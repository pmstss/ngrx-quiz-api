import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { AuthRepo } from '../db/auth-repo';
import { TokenRepo } from '../db/token-repo';

const authController = new AuthController(new AuthRepo(), new TokenRepo());

export const authRouter = Router();
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/logout', authController.logout.bind(authController));
authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/refresh-token', authController.refreshToken.bind(authController));
authRouter.post('/reset', authController.resetPass.bind(authController));
