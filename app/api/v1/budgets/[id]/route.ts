import { db } from '@/lib/db';
import { getApiUser, json, optionsResponse, unauthorized } from '@/lib/api';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const { id } = await context.params;
  const result = await db.categoryBudget.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return json({ ok: false, error: 'Not found' }, 404);
  }

  return json({ ok: true });
}
