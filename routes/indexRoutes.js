import { Router } from "express";
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas pela autenticação
router.use('/order', orderRoutes);

export default router;
