import { Router } from 'express';
import { AdminQuizController } from '../controllers/admin-quiz-controller';

const controller = new AdminQuizController();

export const adminQuizRouter = Router();

adminQuizRouter.get('/quizes/:quizId', controller.getQuiz.bind(controller));
adminQuizRouter.get('/items/:itemId', controller.getItem.bind(controller));
adminQuizRouter.post('/items?quizId=:quizId', controller.createItem.bind(controller));
adminQuizRouter.put('/items/:itemId', controller.updateItem.bind(controller));
adminQuizRouter.post('/items/:itemId/choices', controller.createChoice.bind(controller));
