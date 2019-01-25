import { Router } from 'express';
import { AdminQuizController } from '../controllers/admin-quiz-controller';
import { AdminQuizRepo } from '../db/admin-quiz-repo';

const controller = new AdminQuizController(new AdminQuizRepo());

const router = Router();
router.post('/', controller.createQuiz.bind(controller));
router.get('/:quizId', controller.getQuiz.bind(controller));
router.put('/:quizId', controller.updateQuiz.bind(controller));
router.delete('/:quizId', controller.deleteQuiz.bind(controller));

export const adminQuizRouter = router;
