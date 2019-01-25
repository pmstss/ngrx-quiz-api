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