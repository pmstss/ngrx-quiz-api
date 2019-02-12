/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { OAuthController } from './oauth-controller';
import { TokenRepo } from '../token/token-repo';
import { AuthRepo } from '../auth/auth-repo';

const controller = new OAuthController(new TokenRepo(), new AuthRepo());

const router = Router();
router.get('/google', controller.google.bind(controller));
router.get('/github', controller.github.bind(controller));

export const oauthRouter = router;
