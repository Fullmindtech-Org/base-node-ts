import express, { Request, Response, NextFunction } from 'express';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next();
});

// Rutas centralizadas
app.use('/api', router);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
