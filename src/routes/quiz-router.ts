import { Router } from 'express';
import { QuizController } from '../controllers/quiz-controller';

const quizController = new QuizController();

export const quizRouter = Router();
quizRouter.get('/quizes', quizController.getQuizList.bind(quizController));
quizRouter.get('/quizes/:shortName', quizController.getQuiz.bind(quizController));
quizRouter.get('/items/:itemId', quizController.getItem.bind(quizController));
quizRouter.post('/answers/:itemId', quizController.submitAnswer.bind(quizController));

// TODO ###
quizRouter.get('/refresh-ids', quizController.refreshItemIds.bind(quizController));
