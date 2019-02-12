/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Response, NextFunction } from 'express';
import { TopScore, QuizScore, QuizPosition } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { ScoreRepo } from '../score/score-repo';
import { ApiError } from '../../api/api-error';

export class ScoreController {
    constructor(private repo: ScoreRepo) {
    }

    getTopScores(req: ApiRequest, res: Response, next: NextFunction): Promise<TopScore[]> {
        return writeResponse(this.repo.getTopScores(req.params.quizId), req, res, next);
    }

    getQuizScore(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizScore> {
        const quizId = req.params.quizId;
        if (!req.stateService.hasQuizState(quizId)) {
            throw new ApiError('Quiz is not initialized', 409);
        }

        if (!req.stateService.isFinished(quizId)) {
            throw new ApiError('Quiz is not finished', 409);
        }

        const state = req.stateService.getQuizState(quizId);
        const percentScore = state.score / state.itemIds.length;
        return writeResponse(
            this.repo.getQuizPosition(quizId, percentScore).then((quizPosition: QuizPosition): QuizScore => ({
                ...quizPosition,
                score: percentScore
            })),
            req, res, next
        );
    }

    getQuizScoreStats(req: ApiRequest, res: Response, next: NextFunction): Promise<number[]> {
        const quizId = req.params.quizId;
        if (!req.stateService.hasQuizState(quizId)) {
            throw new ApiError('Quiz is not initialized', 409);
        }

        if (!req.stateService.isFinished(quizId)) {
            throw new ApiError('Quiz is not finished', 409);
        }

        return writeResponse(
            this.repo.getQuizScoreStats(req.params.quizId, req.stateService.getTotalQuestions(quizId)),
            req, res, next
        );
    }
}
