/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { AdminQuizItemController } from './admin-quiz-item-controller';
import { AdminQuizItemRepo } from './admin-quiz-item-repo';

const controller = new AdminQuizItemController(new AdminQuizItemRepo());

const router = Router();
router.post('/', controller.createItem.bind(controller));
router.get('/:itemId', controller.getItem.bind(controller));
router.put('/:itemId', controller.updateItem.bind(controller));
router.delete('/:itemId', controller.deleteItem.bind(controller));

router.put('/order/:quizId', controller.updateQuizItemsOrder.bind(controller));

export const adminQuizItemRouter = router;
