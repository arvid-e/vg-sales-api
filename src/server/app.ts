import express from 'express';
import router from './routes/router.js';
import { globalErrorHandler } from './middlewares/error-handler.js';
import { handleUndefinedRoutes } from './middlewares/handle-undefined-routes.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => {
  res.json({ message: 'API loaded successfully.', status: 'ok' });
});

app.use(router);
app.all('{*path}', handleUndefinedRoutes);
app.use(globalErrorHandler);


