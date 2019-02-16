/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { AdminQuizController } from './admin-quiz-controller';
import { AdminQuizRepo } from './admin-quiz-repo';

const controller = new AdminQuizController(new AdminQuizRepo());

const router = Router();
router.get('/', controller.getQuizList.bind(controller));
router.post('/', controller.createQuiz.bind(controller));
router.get('/:quizId', controller.getQuiz.bind(controller));
router.put('/order', controller.updateQuizOrder.bind(controller));
router.put('/:quizId', controller.updateQuiz.bind(controller));
router.delete('/:quizId', controller.deleteQuiz.bind(controller));
router.post('/publish/:quizId', controller.publishQuiz.bind(controller));
router.delete('/unpublish/:quizId', controller.unpublishQuiz.bind(controller));

export const adminQuizRouter = router;
