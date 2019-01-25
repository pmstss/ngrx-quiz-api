import { Router } from 'express';
import { QuizRepo } from '../db/quiz-repo';
import { ScoreRepo } from '../db/score-repo';
import { QuizController } from '../controllers/quiz-controller';

const controller = new QuizController(new QuizRepo(), new ScoreRepo());

export const quizRouter = Router();
quizRouter.get('/quizes', controller.getQuizList.bind(controller));
quizRouter.get('/quizes/:shortName', controller.getQuiz.bind(controller));
quizRouter.post('/reset/:quizId', controller.resetQuizState.bind(controller));
quizRouter.get('/top/:quizId', controller.getTopScores.bind(controller));
