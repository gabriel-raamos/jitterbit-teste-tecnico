import { Router } from "express";
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = Router();

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas protegidas pela autenticação
app.use('/order', orderRoutes);

export default router;
