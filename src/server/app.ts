import express from 'express';
import router from './routes/router.js';
import { globalErrorHandler } from './middlewares/error-handler.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.json({
    message: 'API loaded successfully.',
    status: 'ok',
  });
});
