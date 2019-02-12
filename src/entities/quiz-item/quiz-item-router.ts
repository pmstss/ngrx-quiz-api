/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { QuizItemRepo } from './quiz-item-repo';
import { ScoreRepo } from '../score/score-repo';
import { QuizItemController } from './quiz-item-controller';

const controller = new QuizItemController(new QuizItemRepo(), new ScoreRepo());

export const router = Router();
router.get('/', controller.getQuizItems.bind(controller));
router.get('/:itemId', controller.getItem.bind(controller));
router.post('/answers/:itemId', controller.submitAnswer.bind(controller));

export const quizItemRouter = router;
