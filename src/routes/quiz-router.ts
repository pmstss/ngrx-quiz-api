import { Router } from 'express';
import { QuizController } from '../controllers/quiz-controller';
import { QuizRepo } from '../db/quiz-repo';

const controller = new QuizController(new QuizRepo());

export const quizRouter = Router();
quizRouter.get('/quizes', controller.getQuizList.bind(controller));
quizRouter.get('/quizes/:shortName', controller.getQuiz.bind(controller));
quizRouter.get('/items/:itemId', controller.getItem.bind(controller));
quizRouter.post('/answers/:itemId', controller.submitAnswer.bind(controller));
quizRouter.post('/reset/:quizId', controller.resetQuizState.bind(controller));

quizRouter.get('/top/:quizId', controller.getTopScores.bind(controller));
