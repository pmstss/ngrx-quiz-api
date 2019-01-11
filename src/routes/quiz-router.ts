import { Router } from 'express';
import { QuizController } from '../controllers/quiz-controller';

const controller = new QuizController();

export const quizRouter = Router();
quizRouter.get('/quizes', controller.getQuizList.bind(controller));
quizRouter.get('/quizes/:shortName', controller.getQuiz.bind(controller));
quizRouter.get('/items/:itemId', controller.getItem.bind(controller));
quizRouter.post('/answers/:itemId', controller.submitAnswer.bind(controller));
