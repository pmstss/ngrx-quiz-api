import { Router } from 'express';
import { AdminQuizItemController } from '../controllers/admin-quiz-item-controller';
import { AdminQuizItemRepo } from '../db/admin-quiz-item-repo';

const controller = new AdminQuizItemController(new AdminQuizItemRepo());

const router = Router();
router.post('/', controller.createItem.bind(controller));
router.get('/:itemId', controller.getItem.bind(controller));
router.put('/:itemId', controller.updateItem.bind(controller));
router.delete('/:itemId', controller.deleteItem.bind(controller));

router.put('/order/:quizId', controller.updateQuizItemsOrder.bind(controller));

export const adminQuizItemRouter = router;
