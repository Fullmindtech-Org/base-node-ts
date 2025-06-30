import { Repository } from 'typeorm';
import { User } from '../models/User';
import AppDataSource from '@/data-source';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { AppError } from '@/middleware/error.middleware';
import { logger } from '@/utils/logger';
import bcrypt from 'bcrypt';

class UsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Usuario creado
   */
  async create(userData: CreateUserDTO): Promise<User> {
    try {
      const user = this.ormRepository.create(userData);
      return await this.ormRepository.save(user);
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw new AppError(500, 'Error al crear el usuario');
    }
  }

  /**
   * Busca un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado o null
   */
  async findById(id: string): Promise<User | null> {
    try {
      return await this.ormRepository.findOne({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error al buscar usuario ${id}:`, error);
      throw new AppError(500, 'Error al buscar el usuario');
    }
  }

  /**
   * Busca un usuario por su email
   * @param email Email del usuario
   * @returns Usuario encontrado o null
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.ormRepository.findOne({
        where: { email }
      });
    } catch (error) {
      logger.error(`Error al buscar usuario por email ${email}:`, error);
      throw new AppError(500, 'Error al buscar el usuario');
    }
  }

  /**
   * Busca un usuario por su nombre de usuario
   * @param username Nombre de usuario
   * @returns Usuario encontrado o null
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.ormRepository.findOne({
        where: { username }
      });
    } catch (error) {
      logger.error(`Error al buscar usuario por username ${username}:`, error);
      throw new AppError(500, 'Error al buscar el usuario');
    }
  }

  /**
   * Verifica las credenciales de un usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Usuario si las credenciales son válidas, null en caso contrario
   */
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      return user;
    } catch (error) {
      logger.error(`Error al verificar credenciales para ${email}:`, error);
      throw new AppError(500, 'Error al verificar las credenciales');
    }
  }

  /**
   * Actualiza un usuario existente
   * @param id ID del usuario a actualizar
   * @param userData Datos actualizados del usuario
   * @returns Usuario actualizado
   */
  async update(id: string, userData: UpdateUserDTO): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new AppError(404, 'Usuario no encontrado');
      }

      Object.assign(user, userData);
      return await this.ormRepository.save(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error al actualizar usuario ${id}:`, error);
      throw new AppError(500, 'Error al actualizar el usuario');
    }
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   */
  async delete(id: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new AppError(404, 'Usuario no encontrado');
      }

      await this.ormRepository.remove(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error al eliminar usuario ${id}:`, error);
      throw new AppError(500, 'Error al eliminar el usuario');
    }
  }
}

export default UsersRepository;
