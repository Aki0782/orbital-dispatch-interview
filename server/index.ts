import cors from 'cors';
import express from 'express';
import stationRoutes from './routes/stationRoutes.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.use('/api', stationRoutes);

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Station API running on http://localhost:${port}/api`);
});
