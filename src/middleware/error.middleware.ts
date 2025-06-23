import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ValidationError {
  path: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public validationErrors?: ValidationError[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  logger.error(`Error: ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.validationErrors && { errors: err.validationErrors }),
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};
