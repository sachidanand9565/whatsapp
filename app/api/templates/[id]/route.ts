/**
 * DELETE /api/templates/[id]  — delete template from DB + Meta
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';
import { RowDataPacket } from 'mysql2';
import axios from 'axios';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = requireAuth(req);
    const id = parseInt(params.id, 10);
    if (!id) return apiError('Invalid id', 400);

    // Verify ownership
    const rows = await query<RowDataPacket[]>(
      'SELECT id, name, language, meta_template_id FROM templates WHERE id = ? AND workspace_id = ? LIMIT 1',
      [id, payload.workspaceId]
    );
    if (rows.length === 0) return apiError('Not found', 404);

    const tpl = rows[0];

    // Try to delete from Meta (best-effort — don't block on failure)
    if (tpl.meta_template_id) {
      try {
        const ws = await query<RowDataPacket[]>(
          'SELECT access_token, waba_id FROM workspaces WHERE id = ?',
          [payload.workspaceId]
        );
        const wsRow      = ws[0] || {};
        const accessToken = (wsRow.access_token as string) || process.env.WHATSAPP_ACCESS_TOKEN || '';
        const wabaId      = (wsRow.waba_id      as string) || process.env.WABA_ID              || '';

        if (accessToken && wabaId) {
          await axios.delete(
            `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
            {
              params: { name: tpl.name, hsm_id: tpl.meta_template_id },
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
        }
      } catch {
        // Meta deletion failed — still delete locally
      }
    }

    await execute('DELETE FROM templates WHERE id = ? AND workspace_id = ?', [id, payload.workspaceId]);

    return apiSuccess({ deleted: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') return apiError('Unauthorized', 401);
    return apiError('Server error', 500);
  }
}
