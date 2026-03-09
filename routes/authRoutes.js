import { Router } from "express";
import { login } from "../controllers/authController.js ";

const router = Router();

// ENDPOINT PÚBLICO DE LOGIN
router.post('/login', login);

export default router;