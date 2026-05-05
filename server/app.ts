import cors from 'cors';
import express from 'express';
import stationRoutes from './routes/stationRoutes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.use('/api', stationRoutes);

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' });
  });

  return app;
}
