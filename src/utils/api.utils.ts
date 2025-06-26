import { Response } from 'express';
import { ApiResponse, ApiError } from '@/types/api.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  meta?: ApiResponse['meta']
): Response => {
  const response: ApiResponse<T> = {
    status: 'success',
    data,
    ...(message && { message }),
    ...(meta && { meta })
  };

  return res.status(200).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message?: string
): Response => {
  const response: ApiResponse<T> = {
    status: 'success',
    data,
    ...(message && { message })
  };

  return res.status(201).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: ApiError['errors']
): Response => {
  const response: ApiError = {
    status: 'error',
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
}; 