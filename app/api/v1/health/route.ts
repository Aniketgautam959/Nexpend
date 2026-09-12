import { json, optionsResponse } from '@/lib/api';

export function OPTIONS(): Response {
  return optionsResponse();
}

export function GET(): Response {
  return json({
    ok: true,
    service: 'nexpend',
    version: 'v1',
  });
}
