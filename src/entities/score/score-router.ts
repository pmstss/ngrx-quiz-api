import { Router } from 'express';
import { ScoreRepo } from '../score/score-repo';
import { ScoreController } from './score-controller';

const controller = new ScoreController(new ScoreRepo());

const router = Router();
router.get('/top/:quizId', controller.getTopScores.bind(controller));
router.get('/quiz/:quizId', controller.getQuizScore.bind(controller));

export const quizScoreRouter = router;
