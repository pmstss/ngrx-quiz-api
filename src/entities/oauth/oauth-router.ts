import { Router } from 'express';
import { OAuthController } from './oauth-controller';
import { TokenRepo } from '../token/token-repo';
import { AuthRepo } from '../auth/auth-repo';

const controller = new OAuthController(new TokenRepo(), new AuthRepo());

const router = Router();
router.get('/google', controller.google.bind(controller));

export const oauthRouter = router;
