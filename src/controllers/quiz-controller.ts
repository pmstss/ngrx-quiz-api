import { Response } from 'express';
import { NextFunction } from 'connect';
import { QuizRepo } from '../db/quiz-repo';
import { ScoreRepo } from '../db/score-repo';
import { ApiRequest } from '../api/api-request';
import { ApiError } from '../api/api-error';
import { writeResponse, writeErrorResponse } from '../api/response-writer';
import { Quiz } from '../models/quiz';
import { QuizState, ClientQuizState } from '../state/quiz-state';

export class QuizController {
    constructor(private repo: QuizRepo, private scoreRepo: ScoreRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.getQuizList().then((quizes: Quiz[]): Quiz[] =>
                quizes.map(quiz => ({
                    ...quiz,
                    started: req.stateService.isStarted(quiz.id),
                    finished: req.stateService.isFinished(quiz.id)
                }))
            ),
            req, res, next
        );
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.getQuiz(req.params.shortName)
                .then((quiz: Quiz): {quizMeta: Quiz, quizState: ClientQuizState } => {
                    req.stateService.initQuizState(quiz);
                    return {
                        quizMeta: quiz,
                        quizState: req.stateService.getClientQuizState(quiz.id)
                    };
                }),
            req, res, next
        );
    }

    resetQuizState(req: ApiRequest, res: Response, next: NextFunction) {
        const quizState: QuizState = req.stateService.getQuizState(req.params.quizId);
        if (!quizState) {
            writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        } else {
            req.stateService.resetQuizState(req.params.quizId);
            writeResponse(Promise.resolve(null), req, res, next);
        }
    }

    getTopScores(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.scoreRepo.getTopScores(req.params.quizId), req, res, next);
    }
}
