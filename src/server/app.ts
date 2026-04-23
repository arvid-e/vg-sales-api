import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {
  getApiV1Root,
  getHealth,
  getRoot,
} from './controllers/health-controller.js';
import { globalErrorHandler } from './middlewares/error-handler.js';
import { handleUndefinedRoutes } from './middlewares/handle-undefined-routes.js';
import router from './routes/router.js';
const swaggerDocument = YAML.load('./swagger.yml');

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.get('/', getRoot);
app.get('/api/v1', getApiV1Root);
app.get('/health', getHealth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', router);

app.all('{*path}', handleUndefinedRoutes);
app.use(globalErrorHandler);
