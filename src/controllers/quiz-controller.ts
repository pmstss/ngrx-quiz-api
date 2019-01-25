import { Response } from 'express';
import { NextFunction } from 'connect';
import { QuizRepo } from '../db/quiz-repo';
import { ScoreRepo } from '../db/score-repo';
import { ApiRequest } from '../api/api-request';
import { ApiError } from '../api/api-error';
import { writeResponse, writeErrorResponse } from '../api/response-writer';
import { Quiz, QuizListItem } from '../models/quiz';
import { QuizState, ClientQuizState } from '../state/quiz-state';
import { QuizScore } from '../models/quiz-score';

export class QuizController {
    constructor(private repo: QuizRepo, private scoreRepo: ScoreRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizListItem[]> {
        return writeResponse(
            this.repo.getQuizList().then(
                (quizes: (Quiz & {totalQuestions: number})[]): QuizListItem[] =>
                quizes.map((quiz: (Quiz & {totalQuestions: number})): QuizListItem => ({
                    ...quiz,
                    started: req.stateService.isStarted(quiz.id),
                    finished: req.stateService.isFinished(quiz.id)
                }))
            ),
            req, res, next
        );
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<Quiz & ClientQuizState> {
        return writeResponse(
            this.repo.getQuiz(req.params.shortName)
                .then((quiz: Quiz): Quiz & ClientQuizState => {
                    req.stateService.initQuizState(quiz);
                    return {
                        ...quiz,
                        ...req.stateService.getClientQuizState(quiz.id)
                    };
                }),
            req, res, next
        );
    }

    resetQuizState(req: ApiRequest, res: Response, next: NextFunction): void {
        const quizState: QuizState = req.stateService.getQuizState(req.params.quizId);
        if (!quizState) {
            writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        } else {
            req.stateService.resetQuizState(req.params.quizId);
            writeResponse(Promise.resolve(null), req, res, next);
        }
    }

    getTopScores(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizScore[]> {
        return writeResponse(this.scoreRepo.getTopScores(req.params.quizId), req, res, next);
    }
}
