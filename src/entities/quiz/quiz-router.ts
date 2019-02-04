import { Router } from 'express';
import { QuizRepo } from './quiz-repo';
import { QuizController } from './quiz-controller';

const controller = new QuizController(new QuizRepo());

const router = Router();
router.get('/', controller.getQuizList.bind(controller));
router.get('/:shortName', controller.getQuiz.bind(controller));
router.post('/reset/:quizId', controller.resetQuizState.bind(controller));

export const quizRouter = router;
