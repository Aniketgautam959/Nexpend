import { json, optionsResponse } from '@/lib/api';

export function OPTIONS() {
  return optionsResponse();
}

export function GET() {
  return json({
    ok: true,
    service: 'nexpend',
    version: 'v1',
  });
}
