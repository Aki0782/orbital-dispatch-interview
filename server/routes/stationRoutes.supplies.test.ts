import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();

describe('station supplies API', () => {
  test('GET /api/supplies/priority returns high priority crates before medium and low priority crates', async () => {
    const response = await request(app).get('/api/supplies/priority');

    expect(response.status).toBe(200);
    expect(response.body.map((crate: { label: string }) => crate.label)).toEqual([
      'Sealant cartridges',
      'Plasma stabilizers',
      'Nutrient gel packs',
      'Antiseptic foam'
    ]);
  });
});
