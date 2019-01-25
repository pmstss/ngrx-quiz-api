import { Router } from 'express';
import { CommentController } from './item-comment-controller';
import { CommentRepo } from './item-comment-repo';

const controller = new CommentController(new CommentRepo());

export const router = Router();
router.get('/item/:itemId', controller.getComments.bind(controller));
router.post('/item/:itemId', controller.addComment.bind(controller));

export const itemCommentRouter = router;
