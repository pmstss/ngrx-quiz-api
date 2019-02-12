import { Router } from 'express';
import { AdminQuizController } from './admin-quiz-controller';
import { AdminQuizRepo } from './admin-quiz-repo';

const controller = new AdminQuizController(new AdminQuizRepo());

const router = Router();
router.post('/', controller.createQuiz.bind(controller));
router.get('/:quizId', controller.getQuiz.bind(controller));
router.put('/:quizId', controller.updateQuiz.bind(controller));
router.delete('/:quizId', controller.deleteQuiz.bind(controller));
router.post('/publish/:quizId', controller.publishQuiz.bind(controller));
router.delete('/unpublish/:quizId', controller.unpublishQuiz.bind(controller));

export const adminQuizRouter = router;
