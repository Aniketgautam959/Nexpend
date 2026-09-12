import { db } from '@/lib/db';
import { json, optionsResponse, requireApiUser } from '@/lib/api';

export function OPTIONS() {
  return optionsResponse();
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const { id } = await context.params;
  const result = await db.categoryBudget.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return json({ ok: false, error: 'Not found' }, 404);
  }

  return json({ ok: true });
}
