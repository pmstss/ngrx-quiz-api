import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';

const authController = new AuthController();

export const authRouter = Router();
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/logout', authController.logout).bind(authController);
authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/reset', authController.resetPass.bind(authController));
