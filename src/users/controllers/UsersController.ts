import { Request, Response } from 'express';
import UsersService from '../services/UsersService';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { AppError } from '@/middleware/error.middleware';
import { logger } from '@/utils/logger';
import { sendSuccess, sendCreated, sendError } from '@/utils/api.utils';

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crea un nuevo usuario
   * @param req Request con los datos del usuario
   * @param res Response
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body as CreateUserDTO;
      const user = await this.usersService.createUser(userData);
      sendCreated(res, user, 'Usuario creado exitosamente');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.message, error.statusCode, error.validationErrors);
        return;
      }
      logger.error('Error en createUser:', error);
      sendError(res, 'Error interno del servidor');
    }
  };

  /**
   * Obtiene un usuario por su ID
   * @param req Request con el ID del usuario
   * @param res Response
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.usersService.getUserById(id);

      if (!user) {
        sendError(res, 'Usuario no encontrado', 404);
        return;
      }

      sendSuccess(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      logger.error('Error en getUserById:', error);
      sendError(res, 'Error interno del servidor');
    }
  };

  /**
   * Actualiza un usuario existente
   * @param req Request con el ID y datos actualizados del usuario
   * @param res Response
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body as UpdateUserDTO;
      const user = await this.usersService.updateUser(id, userData);
      sendSuccess(res, user, 'Usuario actualizado exitosamente');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      logger.error('Error en updateUser:', error);
      sendError(res, 'Error interno del servidor');
    }
  };

  /**
   * Elimina un usuario
   * @param req Request con el ID del usuario
   * @param res Response
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.usersService.deleteUser(id);
      sendSuccess(res, null, 'Usuario eliminado exitosamente');
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      logger.error('Error en deleteUser:', error);
      sendError(res, 'Error interno del servidor');
    }
  };
}

export default UsersController;
