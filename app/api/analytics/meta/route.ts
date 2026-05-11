/**
 * GET /api/analytics/meta
 * Fetches messaging analytics from Meta WhatsApp Cloud API
 * Docs: https://developers.facebook.com/docs/whatsapp/business-management-api/analytics
 *
 * Query params:
 *   start_date  - YYYY-MM-DD  (default: 30 days ago)
 *   end_date    - YYYY-MM-DD  (default: today)
 *   granularity - DAY | MONTH (default: DAY)
 */
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';
import { createWAClient } from '@/lib/whatsapp';
import { RowDataPacket } from 'mysql2';

function toUnix(dateStr: string, endOfDay = false): number {
  const d = new Date(dateStr);
  if (endOfDay) { d.setHours(23, 59, 59, 999); }
  else          { d.setHours(0, 0, 0, 0); }
  return Math.floor(d.getTime() / 1000);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    const payload = requireAuth(req);
    const wid     = payload.workspaceId;

    // Get workspace credentials
    const ws = await queryOne<RowDataPacket>(
      'SELECT waba_id, access_token FROM workspaces WHERE id = ?',
      [wid]
    );

    if (!ws?.waba_id || !ws?.access_token) {
      return apiError('WhatsApp not connected. Please set up your WABA credentials in Settings.', 400);
    }

    const sp          = new URL(req.url).searchParams;
    const startDate   = sp.get('start_date')  || daysAgo(29);
    const endDate     = sp.get('end_date')    || new Date().toISOString().slice(0, 10);
    const granularity = sp.get('granularity') || 'DAY';

    const META_MIN_UNIX = 1764633600; // Dec 1, 2025 — Meta analytics start date
    const start = Math.max(toUnix(startDate), META_MIN_UNIX);
    const end   = toUnix(endDate, true);

    const client = createWAClient(ws.access_token);

    // ── Messaging Analytics — WABA fields syntax (working approach)
    const { data: msgData } = await client.get(`/${ws.waba_id}`, {
      params: {
        fields: `analytics.start(${start}).end(${end}).granularity(${granularity}){data_points{start,end,sent,delivered}}`,
      },
    });

    // ── Conversation Analytics (conversations + cost) ────────────────────────
    const { data: convData } = await client.get(`/${ws.waba_id}/conversation_analytics`, {
      params: {
        fields: `conversation_analytics.start(${start}).end(${end}).granularity(${granularity}).dimensions(["CONVERSATION_TYPE"]){data_points{start,end,conversation,cost}}`,
      },
    });

    // Parse messaging data_points
    const msgPoints: { date: string; sent: number; delivered: number }[] =
      (msgData?.analytics?.data_points || []).map((p: any) => ({
        date:      new Date(p.start * 1000).toISOString().slice(0, 10),
        sent:      p.sent      ?? 0,
        delivered: p.delivered ?? 0,
      }));

    // Parse conversation data_points (flatten all conversation types)
    const convMap: Record<string, { conversations: number; cost: number }> = {};
    for (const group of (convData?.conversation_analytics?.data || [])) {
      for (const p of (group?.data_points || [])) {
        const date = new Date(p.start * 1000).toISOString().slice(0, 10);
        if (!convMap[date]) convMap[date] = { conversations: 0, cost: 0 };
        convMap[date].conversations += p.conversation ?? 0;
        convMap[date].cost          += parseFloat(p.cost ?? '0');
      }
    }

    const convPoints = Object.entries(convMap).map(([date, v]) => ({
      date,
      conversations: v.conversations,
      cost:          parseFloat(v.cost.toFixed(4)),
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Totals
    const totalSent      = msgPoints.reduce((s, p) => s + p.sent, 0);
    const totalDelivered = msgPoints.reduce((s, p) => s + p.delivered, 0);
    const totalConv      = convPoints.reduce((s, p) => s + p.conversations, 0);
    const totalCost      = convPoints.reduce((s, p) => s + p.cost, 0);

    return apiSuccess({
      summary: {
        total_sent:          totalSent,
        total_delivered:     totalDelivered,
        delivery_rate:       totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0,
        total_conversations: totalConv,
        total_cost_usd:      parseFloat(totalCost.toFixed(4)),
      },
      messaging:     msgPoints,
      conversations: convPoints,
      meta: {
        start_date:   startDate,
        end_date:     endDate,
        granularity,
        waba_id:      ws.waba_id,
      },
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return apiError('Unauthorized', 401);

    // Meta API error
    const metaError = err?.response?.data?.error;
    if (metaError) {
      return apiError(`Meta API: ${metaError.message}`, 400);
    }

    console.error('[analytics/meta]', err);
    return apiError('Server error', 500);
  }
}
