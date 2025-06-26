import 'dotenv/config';
import 'reflect-metadata';
import app from './app';
import AppDataSource, { initializeDatabase } from '@/data-source';
import { logger } from '@/utils/logger';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { Server } from 'http';

const PORT = process.env.PORT || 3000;

// Configuración de seguridad y optimización
app.use(helmet());
app.use(cors());
app.use(compression());

let server: Server;

// Inicialización de la base de datos y servidor
const startServer = async () => {
  try {
    await initializeDatabase();
    logger.info('Base de datos conectada exitosamente');

    server = app.listen(PORT, () => {
      logger.info(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejador de señales para cierre graceful
const gracefulShutdown = async () => {
  logger.info('Recibida señal de cierre. Cerrando servidor...');

  if (server) {
    server.close(() => {
      logger.info('Servidor HTTP cerrado');
      AppDataSource.destroy()
        .then(() => {
          logger.info('Conexión a la base de datos cerrada');
          process.exit(0);
        })
        .catch((error: Error) => {
          logger.error('Error al cerrar la conexión a la base de datos:', error);
          process.exit(1);
        });
    });
  }
};

// Manejadores de señales
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();
