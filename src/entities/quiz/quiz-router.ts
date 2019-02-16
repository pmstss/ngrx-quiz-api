/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { tokenGuard } from '../../token/token-guard';
import { stateGuard } from '../../state/state-guard';
import { QuizRepo } from './quiz-repo';
import { QuizController } from './quiz-controller';

const controller = new QuizController(new QuizRepo());

const router = Router();
router.get('/', stateGuard, controller.getQuizList.bind(controller));
router.get('/:shortName', stateGuard, controller.getQuiz.bind(controller));
router.post('/reset/:quizId', stateGuard, tokenGuard, controller.resetQuizState.bind(controller));

export const quizRouter = router;
