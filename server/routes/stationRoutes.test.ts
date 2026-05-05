import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();

describe('station API existing bug fixes', () => {
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

describe('station incidents API', () => {
  test('GET /api/incidents returns incident list', async () => {
    const response = await request(app).get('/api/incidents');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('POST /api/incidents creates a valid incident', async () => {
    const response = await request(app).post('/api/incidents').send({
      title: 'Solar panel vibration spike',
      severity: 'medium',
      moduleId: 2,
      assignedCrewId: 102
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: 'Solar panel vibration spike',
      severity: 'medium',
      status: 'open',
      moduleId: 2,
      assignedCrewId: 102
    });
    expect(typeof response.body.id).toBe('number');
    expect(typeof response.body.createdAt).toBe('string');
  });

  test('POST /api/incidents rejects empty title', async () => {
    const response = await request(app).post('/api/incidents').send({
      title: '',
      severity: 'high',
      moduleId: 3,
      assignedCrewId: 104
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('title');
  });

  test('POST /api/incidents rejects invalid severity', async () => {
    const response = await request(app).post('/api/incidents').send({
      title: 'Bad severity',
      severity: 'urgent',
      moduleId: 3,
      assignedCrewId: 104
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('severity');
  });

  test('POST /api/incidents rejects unknown moduleId', async () => {
    const response = await request(app).post('/api/incidents').send({
      title: 'Unknown module',
      severity: 'low',
      moduleId: 9999,
      assignedCrewId: 104
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('moduleId');
  });

  test('POST /api/incidents rejects unknown assignedCrewId', async () => {
    const response = await request(app).post('/api/incidents').send({
      title: 'Unknown crew',
      severity: 'low',
      moduleId: 3,
      assignedCrewId: 9999
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('assignedCrewId');
  });

  test('PATCH /api/incidents/:id/resolve marks incident as resolved', async () => {
    const createResponse = await request(app).post('/api/incidents').send({
      title: 'Docking collar pressure alert',
      severity: 'high',
      moduleId: 3,
      assignedCrewId: 104
    });

    const response = await request(app).patch(`/api/incidents/${createResponse.body.id}/resolve`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: createResponse.body.id,
      status: 'resolved'
    });
  });

  test('PATCH /api/incidents/:id/resolve returns 404 for unknown incident', async () => {
    const response = await request(app).patch('/api/incidents/9999/resolve');

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Incident not found');
  });
});
