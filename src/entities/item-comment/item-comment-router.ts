/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { CommentController } from './item-comment-controller';
import { CommentRepo } from './item-comment-repo';

const controller = new CommentController(new CommentRepo());

export const router = Router();
router.get('/item/:itemId', controller.getComments.bind(controller));
router.post('/item/:itemId', controller.addComment.bind(controller));

export const itemCommentRouter = router;
