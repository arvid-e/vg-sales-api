import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { globalErrorHandler } from './middlewares/error-handler.js';
import { handleUndefinedRoutes } from './middlewares/handle-undefined-routes.js';
import router from './routes/router.js';
import { getHealth } from './controllers/health-controller.js';

const swaggerDocument = YAML.load('./swagger.yml');

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/health', getHealth)
app.use('/api/v1', router);
app.all('{*path}', handleUndefinedRoutes);
app.use(globalErrorHandler);
