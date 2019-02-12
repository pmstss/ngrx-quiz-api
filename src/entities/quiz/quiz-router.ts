/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { QuizRepo } from './quiz-repo';
import { QuizController } from './quiz-controller';
import { tokenGuard } from '../../token/token-guard';

const controller = new QuizController(new QuizRepo());

const router = Router();
router.get('/', controller.getQuizList.bind(controller));
router.get('/:shortName', controller.getQuiz.bind(controller));
router.post('/reset/:quizId', tokenGuard, controller.resetQuizState.bind(controller));

export const quizRouter = router;
