import { Router } from 'express';
import { QuizRepo } from './quiz-repo';
import { ScoreRepo } from '../score/score-repo';
import { QuizController } from './quiz-controller';

const controller = new QuizController(new QuizRepo(), new ScoreRepo());

export const quizRouter = Router();
quizRouter.get('/', controller.getQuizList.bind(controller));
quizRouter.get('/:shortName', controller.getQuiz.bind(controller));
quizRouter.post('/reset/:quizId', controller.resetQuizState.bind(controller));
quizRouter.get('/top/:quizId', controller.getTopScores.bind(controller));