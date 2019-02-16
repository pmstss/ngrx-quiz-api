/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Router } from 'express';
import { ScoreRepo } from '../score/score-repo';
import { tokenGuard } from '../../token/token-guard';
import { stateGuard } from '../../state/state-guard';
import { ScoreController } from './score-controller';

const controller = new ScoreController(new ScoreRepo());

const router = Router();
router.get('/top/:quizId', stateGuard, controller.getTopScores.bind(controller));
router.get('/quiz/:quizId', stateGuard, tokenGuard, controller.getQuizScore.bind(controller));
router.get('/quiz-stats/:quizId', stateGuard, tokenGuard, controller.getQuizScoreStats.bind(controller));

export const quizScoreRouter = router;
