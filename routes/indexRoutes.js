import { Router } from "express";
import { authenticate } from '../middleware/auth.js';
import { login } from "../controllers/authController.js";
import { createOrder, getOrder, listOrders, updateOrder, deleteOrder } from '../controllers/orderController.js';

const router = Router();

// ENDPOINT PÚBLICO DE LOGIN
router.post('/login', login);

// ENDPOINTS ABAIXO NECESSITARÃO AUTENTICAÇÃO
router.use(authenticate);

// ENDPOINTS RELACIONADOS AOS PEDIDOS ("ORDERS")
router.get('/list', listOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrder);
router.put('/:orderId', updateOrder);
router.delete('/:orderId', deleteOrder);

export default router;
