import express from 'express';
import cors from 'cors';
import routes from './routing';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

// Must be registered last -- Express treats a 4-arg middleware as the error handler.
app.use(errorHandler);

export default app;
