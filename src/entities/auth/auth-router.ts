import { Router } from 'express';
import { AuthController } from './auth-controller';
import { AuthRepo } from './auth-repo';
import { TokenRepo } from '../token/token-repo';

const authController = new AuthController(new AuthRepo(), new TokenRepo());

export const authRouter = Router();
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/logout', authController.logout.bind(authController));
authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/refresh-token', authController.refreshToken.bind(authController));
authRouter.post('/reset', authController.resetPass.bind(authController));
