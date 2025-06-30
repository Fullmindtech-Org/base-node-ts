import { Router } from 'express';
import userRoutes from '@/users/routes/users.routes';

const router = Router();

// Rutas de usuarios
router.use('/users', userRoutes);

export default router;
