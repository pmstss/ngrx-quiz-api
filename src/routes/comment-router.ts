import { Router } from 'express';
import { CommentController } from '../controllers/comment-controller';
import { CommentRepo } from '../db/comment-repo';

const controller = new CommentController(new CommentRepo());

export const commentRouter = Router();
commentRouter.get('/item/:itemId', controller.getComments.bind(controller));
commentRouter.post('/item/:itemId', controller.addComment.bind(controller));
