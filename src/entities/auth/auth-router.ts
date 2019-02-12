/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { AuthController } from './auth-controller';
import { AuthRepo } from './auth-repo';
import { TokenRepo } from '../token/token-repo';

const controller = new AuthController(new AuthRepo(), new TokenRepo());

const router = Router();
router.post('/login', controller.login.bind(controller));
router.post('/anonymous', controller.anonymousLogin.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.post('/register', controller.register.bind(controller));
router.post('/refresh-token', controller.refreshToken.bind(controller));
router.post('/request-password', controller.requestResetPassToken.bind(controller));
router.put('/reset-password', controller.resetPass.bind(controller));

export const authRouter = router;
