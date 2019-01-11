import { Router } from 'express';
import { AdminQuizController } from '../controllers/admin-quiz-controller';
import { AdminQuizRepo } from '../controllers/admin-quiz-repo';

const controller = new AdminQuizController(new AdminQuizRepo());

export const adminQuizRouter = Router();

adminQuizRouter.get('/quizes/:quizId', controller.getQuiz.bind(controller));
adminQuizRouter.post('/quizes', controller.createQuiz.bind(controller));
adminQuizRouter.put('/quizes/:quizId', controller.updateQuiz.bind(controller));
adminQuizRouter.delete('/quizes/:quizId', controller.deleteQuiz.bind(controller));

adminQuizRouter.get('/items/:itemId', controller.getItem.bind(controller));
adminQuizRouter.post('/items?quizId=:quizId', controller.createItem.bind(controller));
adminQuizRouter.put('/items/:itemId', controller.updateItem.bind(controller));
adminQuizRouter.delete('/items/:itemId', controller.deleteItem.bind(controller));

// TODO ### remove?
adminQuizRouter.post('/items/:itemId/choices', controller.createChoice.bind(controller));
