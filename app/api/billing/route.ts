import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';
import { RowDataPacket } from 'mysql2';

const GV = 'v22.0';
const FREE_TIER = 1000;

interface ConvDataPoint {
  start: number;
  end: number;
  conversation: number;
  cost: number;
  conversation_category?: string;
}

interface MsgDataPoint {
  start: number;
  end: number;
  sent: number;
  delivered: number;
  read: number;
}

export async function GET(req: NextRequest) {
  try {
    const payload = requireAuth(req);
    const { searchParams } = new URL(req.url);

    // Support both month param and start/end date params
    const startDate = searchParams.get('start_date');
    const endDate   = searchParams.get('end_date');
    const monthParam = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    let start: number;
    let end: number;
    let label: string;

    if (startDate && endDate) {
      start = Math.floor(new Date(startDate + 'T00:00:00').getTime() / 1000);
      end   = Math.floor(new Date(endDate   + 'T23:59:59').getTime() / 1000);
      label = startDate === endDate ? startDate : `${startDate} to ${endDate}`;
    } else {
      const [year, month] = monthParam.split('-').map(Number);
      start = Math.floor(new Date(year, month - 1, 1).getTime() / 1000);
      end   = Math.floor(new Date(year, month, 0, 23, 59, 59).getTime() / 1000);
      label = monthParam;
    }

    const rows = await query<RowDataPacket[]>(
      `SELECT waba_id, access_token, phone_number_id FROM workspaces WHERE id = ?`,
      [payload.workspaceId]
    );

    if (!rows.length || !rows[0].waba_id || !rows[0].access_token) {
      return apiError('WhatsApp not connected', 400);
    }

    const { waba_id, access_token, phone_number_id } = rows[0] as {
      waba_id: string;
      access_token: string;
      phone_number_id: string | null;
    };

    const token = encodeURIComponent(access_token);

    // 1. Conversation analytics (billing data — 24-72h delay)
    const convUrl =
      `https://graph.facebook.com/${GV}/${waba_id}/conversation_analytics` +
      `?start=${start}&end=${end}&granularity=DAILY` +
      `&dimensions=["CONVERSATION_CATEGORY"]` +
      (phone_number_id ? `&phone_numbers=["${phone_number_id}"]` : '') +
      `&access_token=${token}`;

    // 2. Message analytics (real-time sent/delivered/read)
    const msgUrl = phone_number_id
      ? `https://graph.facebook.com/${GV}/${phone_number_id}/analytics` +
        `?start=${start}&end=${end}&granularity=DAY&access_token=${token}`
      : null;

    const [convRes, msgRes] = await Promise.all([
      fetch(convUrl).then(r => r.json()).catch(() => ({ data: [] })),
      msgUrl ? fetch(msgUrl).then(r => r.json()).catch(() => null) : Promise.resolve(null),
    ]);

    console.log('[billing] conv:', JSON.stringify(convRes).slice(0, 200));
    console.log('[billing] msg:', JSON.stringify(msgRes).slice(0, 200));

    // ── Parse conversation analytics ──────────────────────────────────────
    const byDay: Record<string, {
      date: string;
      marketing: number; utility: number; authentication: number; service: number;
      cost: number; sent: number; delivered: number; read: number;
    }> = {};

    const byCategory: Record<string, { conversations: number; cost: number }> = {
      MARKETING:      { conversations: 0, cost: 0 },
      UTILITY:        { conversations: 0, cost: 0 },
      AUTHENTICATION: { conversations: 0, cost: 0 },
      SERVICE:        { conversations: 0, cost: 0 },
    };

    let totalConversations = 0;
    let totalCost = 0;

    if (!convRes.error && Array.isArray(convRes.data)) {
      const points: ConvDataPoint[] = convRes.data.flatMap(
        (d: { data_points?: ConvDataPoint[]; conversation_category?: string }) =>
          (d.data_points || []).map((dp: ConvDataPoint) => ({
            ...dp,
            conversation_category: dp.conversation_category || d.conversation_category,
          }))
      );

      for (const dp of points) {
        const date = new Date(dp.start * 1000).toISOString().slice(0, 10);
        const cat  = (dp.conversation_category || 'SERVICE').toUpperCase();
        const cnt  = dp.conversation || 0;
        const cost = dp.cost || 0;

        if (!byDay[date]) byDay[date] = { date, marketing: 0, utility: 0, authentication: 0, service: 0, cost: 0, sent: 0, delivered: 0, read: 0 };

        if (cat === 'MARKETING')      byDay[date].marketing      += cnt;
        else if (cat === 'UTILITY')   byDay[date].utility        += cnt;
        else if (cat === 'AUTHENTICATION') byDay[date].authentication += cnt;
        else                          byDay[date].service        += cnt;
        byDay[date].cost += cost;

        if (byCategory[cat]) { byCategory[cat].conversations += cnt; byCategory[cat].cost += cost; }
        totalConversations += cnt;
        totalCost          += cost;
      }
    }

    // ── Parse message analytics ───────────────────────────────────────────
    let totalSent = 0, totalDelivered = 0, totalRead = 0;

    const msgPoints: MsgDataPoint[] = msgRes?.analytics?.data_points || [];
    for (const mp of msgPoints) {
      const date = new Date(mp.start * 1000).toISOString().slice(0, 10);
      if (!byDay[date]) byDay[date] = { date, marketing: 0, utility: 0, authentication: 0, service: 0, cost: 0, sent: 0, delivered: 0, read: 0 };
      byDay[date].sent      += mp.sent      || 0;
      byDay[date].delivered += mp.delivered || 0;
      byDay[date].read      += mp.read      || 0;
      totalSent      += mp.sent      || 0;
      totalDelivered += mp.delivered || 0;
      totalRead      += mp.read      || 0;
    }

    for (const cat of Object.values(byCategory)) cat.cost = Math.round(cat.cost * 10000) / 10000;
    for (const day of Object.values(byDay))      day.cost = Math.round(day.cost * 10000) / 10000;

    return apiSuccess({
      label,
      has_conv_data: totalConversations > 0,
      has_msg_data:  totalSent > 0,
      summary: {
        total_conversations: totalConversations,
        total_cost:          Math.round(totalCost * 10000) / 10000,
        free_tier_used:      Math.min(totalConversations, FREE_TIER),
        free_tier_remaining: Math.max(0, FREE_TIER - totalConversations),
        paid_conversations:  Math.max(0, totalConversations - FREE_TIER),
        total_sent:          totalSent,
        total_delivered:     totalDelivered,
        total_read:          totalRead,
        delivery_rate:       totalSent > 0 ? Math.round((totalDelivered / totalSent) * 1000) / 10 : 0,
      },
      by_category: byCategory,
      daily: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') return apiError('Unauthorized', 401);
    console.error('[billing]', err);
    return apiError('Server error', 500);
  }
}
