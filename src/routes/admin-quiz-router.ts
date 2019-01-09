import { Router } from 'express';
import { AdminQuizController } from '../controllers/admin-quiz-controller';

const adminQuizController = new AdminQuizController();

export const adminQuizRouter = Router();

adminQuizRouter.get(
    '/quizes/:quizId',
    adminQuizController.getQuiz.bind(adminQuizController)
);

adminQuizRouter.get(
    '/items/:itemId',
    adminQuizController.getItem.bind(adminQuizController)
);

adminQuizRouter.post(
    '/items?quizId=:quizId',
    adminQuizController.createItem.bind(adminQuizController)
);

adminQuizRouter.put(
    '/items/:itemId',
    adminQuizController.updateItem.bind(adminQuizController)
);

adminQuizRouter.post(
    '/items/:itemId/choices',
    adminQuizController.createChoice.bind(adminQuizController)
);
