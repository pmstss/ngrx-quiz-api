import { Router } from 'express';
import { QuizItemRepo } from '../db/quiz-item-repo';
import { ScoreRepo } from '../db/score-repo';
import { QuizItemController } from '../controllers/quiz-item-controller';

const controller = new QuizItemController(new QuizItemRepo(), new ScoreRepo());

export const router = Router();
router.get('/items/:itemId', controller.getItem.bind(controller));
router.get('/quiz-items/:quizId', controller.getItems.bind(controller));
router.post('/answers/:itemId', controller.submitAnswer.bind(controller));

export const quizItemRouter = router;
