import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';
import { RowDataPacket } from 'mysql2';

const GV = 'v22.0';
const META_MIN_UNIX = 1764633600; // Dec 1, 2025

export async function GET(req: NextRequest) {
  try {
    const payload = requireAuth(req);

    const rows = await query<RowDataPacket[]>(
      `SELECT waba_id, access_token, phone_number_id FROM workspaces WHERE id = ?`,
      [payload.workspaceId]
    );

    if (!rows.length) return apiError('Workspace not found', 404);
    const { waba_id, access_token, phone_number_id } = rows[0] as any;

    // Dec 1, 2025 → today
    const end   = Math.floor(Date.now() / 1000);
    const start = META_MIN_UNIX;

    // Test 1: Message analytics via WABA ID using fields syntax
    const msgUrl1 = `https://graph.facebook.com/${GV}/${waba_id}?` +
      `fields=analytics.start(${start}).end(${end}).granularity(DAY){data_points{start,end,sent,delivered}}&access_token=${access_token}`;

    // Test 2: Message analytics via phone_number_id
    const msgUrl2 = `https://graph.facebook.com/${GV}/${phone_number_id}/analytics?` +
      `start=${start}&end=${end}&granularity=DAY&access_token=${access_token}`;

    // Test 3: Conversation analytics — no dimensions
    const convUrl = `https://graph.facebook.com/${GV}/${waba_id}/conversation_analytics?` +
      `start=${start}&end=${end}&granularity=DAILY&access_token=${access_token}`;

    // Test 4: Conversation analytics — with phone_numbers filter removed
    const convUrl2 = `https://graph.facebook.com/${GV}/${waba_id}/conversation_analytics?` +
      `start=${start}&end=${end}&granularity=MONTHLY&access_token=${access_token}`;

    const [msg1, msg2, conv1, conv2] = await Promise.all([
      fetch(msgUrl1).then(r => r.json()).catch(e => ({ fetch_error: e.message })),
      fetch(msgUrl2).then(r => r.json()).catch(e => ({ fetch_error: e.message })),
      fetch(convUrl).then(r => r.json()).catch(e => ({ fetch_error: e.message })),
      fetch(convUrl2).then(r => r.json()).catch(e => ({ fetch_error: e.message })),
    ]);

    return apiSuccess({
      workspace:  { waba_id, phone_number_id, has_token: !!access_token },
      date_range: {
        start, end,
        from: new Date(start * 1000).toISOString().slice(0, 10),
        to:   new Date(end   * 1000).toISOString().slice(0, 10),
      },
      msg_via_waba_fields:    msg1,
      msg_via_phone_id:       msg2,
      conv_daily_no_filter:   conv1,
      conv_monthly_no_filter: conv2,
    });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return apiError('Unauthorized', 401);
    return apiError(e?.message || 'Server error', 500);
  }
}
