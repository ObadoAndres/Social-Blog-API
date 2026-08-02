import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
