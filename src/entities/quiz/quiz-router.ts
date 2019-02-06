import { Router } from 'express';
import { QuizRepo } from './quiz-repo';
import { QuizController } from './quiz-controller';
import { tokenGuard } from '../../token/token-guard';

const controller = new QuizController(new QuizRepo());

const router = Router();
router.get('/', controller.getQuizList.bind(controller));
router.get('/:shortName', tokenGuard, controller.getQuiz.bind(controller));
router.post('/reset/:quizId', tokenGuard, controller.resetQuizState.bind(controller));

export const quizRouter = router;
