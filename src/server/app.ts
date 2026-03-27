import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { globalErrorHandler } from './middlewares/error-handler.js';
import { handleUndefinedRoutes } from './middlewares/handle-undefined-routes.js';
import router from './routes/router.js';

const swaggerDocument = YAML.load('./swagger.yml');

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  return isConnected
    ? res.status(200).send('OK')
    : res.status(503).send('Database Disconnected');
});

app.use(router);
app.all('{*path}', handleUndefinedRoutes);
app.use(globalErrorHandler);
