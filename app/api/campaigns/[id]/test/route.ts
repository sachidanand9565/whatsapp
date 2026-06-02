/**
 * POST /api/campaigns/[id]/test
 * Send a test message for a campaign before launching.
 * Body: { phone: "919876543210", variables: { "1": "John", "2": "Delhi" } }
 */
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiSuccess, apiError, normalizePhone } from '@/lib/utils';
import { sendTemplateMessage } from '@/lib/whatsapp';
import { RowDataPacket } from 'mysql2';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const payload = requireAuth(req);
    const campaignId = Number(params.id);

    const { phone, variables } = await req.json();
    if (!phone) return apiError('Phone number is required', 400);

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) return apiError('Invalid phone number', 400);

    // Load campaign + template + workspace creds
    const rows = await query<RowDataPacket[]>(
      `SELECT c.*, t.name as template_name, t.language, t.body_text,
              w.access_token, w.phone_number_id
       FROM campaigns c
       JOIN templates t ON t.id = c.template_id
       JOIN workspaces w ON w.id = c.workspace_id
       WHERE c.id = ? AND c.workspace_id = ?`,
      [campaignId, payload.workspaceId]
    );
    if (rows.length === 0) return apiError('Campaign not found', 404);
    const campaign = rows[0];

    const accessToken = (campaign.access_token as string) || '';
    const phoneNumberId = (campaign.phone_number_id as string) || '';
    if (!accessToken || !phoneNumberId) return apiError('WhatsApp credentials not configured', 400);

    // Build template components from variables
    const components: { type: string; parameters: { type: string; text: string }[] }[] = [];
    if (variables && Object.keys(variables).length > 0) {
      const sortedKeys = Object.keys(variables).sort((a, b) => Number(a) - Number(b));
      components.push({
        type: 'body',
        parameters: sortedKeys.map((k) => ({ type: 'text', text: variables[k] })),
      });
    }

    // Send test message
    const result = await sendTemplateMessage(
      accessToken,
      phoneNumberId,
      normalizedPhone,
      campaign.template_name as string,
      (campaign.language as string) || 'en',
      components,
    );

    const wamid = (result?.messages as Record<string, unknown>[])?.[0]?.id as string | undefined;

    return apiSuccess({ sent: true, phone: normalizedPhone, wamid, message: 'Test message sent successfully!' });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') return apiError('Unauthorized', 401);
    console.error('[campaign/test]', err);
    return apiError('Failed to send test message', 500);
  }
}
