import UsersRepository from '../repositories/UsersRepository';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { User } from '../models/User';
import { AppError } from '../../middleware/error.middleware';
import { logger } from '../../utils/logger';
import bcrypt from 'bcrypt';

class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Usuario creado
   */
  async createUser(userData: CreateUserDTO): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError(400, 'El email ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.usersRepository.create({
        ...userData,
        password: hashedPassword,
      });

      logger.info(`Usuario creado: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error al crear usuario:', error);
      throw new AppError(500, 'Error al crear el usuario');
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado
   */
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new AppError(404, 'Usuario no encontrado');
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error al obtener usuario ${id}:`, error);
      throw new AppError(500, 'Error al obtener el usuario');
    }
  }

  /**
   * Actualiza un usuario
   * @param id ID del usuario
   * @param userData Datos actualizados del usuario
   * @returns Usuario actualizado
   */
  async updateUser(id: string, userData: UpdateUserDTO): Promise<User> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new AppError(404, 'Usuario no encontrado');
      }

      if (userData.email && userData.email !== user.email) {
        const existingUser = await this.usersRepository.findByEmail(userData.email);
        if (existingUser) {
          throw new AppError(400, 'El email ya está registrado');
        }
      }

      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const updatedUser = await this.usersRepository.update(id, userData);
      logger.info(`Usuario actualizado: ${updatedUser.email}`);
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error al actualizar usuario ${id}:`, error);
      throw new AppError(500, 'Error al actualizar el usuario');
    }
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new AppError(404, 'Usuario no encontrado');
      }

      await this.usersRepository.delete(id);
      logger.info(`Usuario eliminado: ${user.email}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error al eliminar usuario ${id}:`, error);
      throw new AppError(500, 'Error al eliminar el usuario');
    }
  }

  /**
   * Autentica a un usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Usuario autenticado
   */
  async authenticateUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.verifyCredentials(email, password);
      if (!user) {
        throw new AppError(401, 'Credenciales inválidas');
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error al autenticar usuario con email ${email}:`, error);
      throw new AppError(500, 'Error al autenticar el usuario');
    }
  }
}

export default UsersService;
