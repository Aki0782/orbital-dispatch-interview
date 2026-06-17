import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();

describe('station modules API', () => {
  test('GET /api/crew/:id returns a valid crew member for an existing numeric ID', async () => {
    const response = await request(app).get('/api/crew/101');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 101,
      name: 'Mara Chen'
    });
  });

  test('GET /api/crew/:id returns 404 for a missing crew member', async () => {
    const response = await request(app).get('/api/crew/9999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Crew member not found');
  });

  test('PATCH /api/modules/:id/status saves stable when requested', async () => {
    const response = await request(app).patch('/api/modules/3/status').send({ status: 'stable' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 3,
      status: 'stable'
    });
  });

  test('PATCH /api/modules/:id/status saves warning when requested', async () => {
    const response = await request(app).patch('/api/modules/1/status').send({ status: 'warning' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      status: 'warning'
    });
  });

  test('PATCH /api/modules/:id/status rejects invalid status', async () => {
    const response = await request(app).patch('/api/modules/1/status').send({ status: 'offline' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Status must be');
  });
});
