import { Router } from 'express';
import { AuthController } from './auth-controller';
import { AuthRepo } from './auth-repo';
import { TokenRepo } from '../token/token-repo';

const controller = new AuthController(new AuthRepo(), new TokenRepo());

const router = Router();
router.post('/login', controller.login.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.post('/register', controller.register.bind(controller));
router.post('/refresh-token', controller.refreshToken.bind(controller));
router.post('/reset', controller.resetPass.bind(controller));

export const authRouter = router;
