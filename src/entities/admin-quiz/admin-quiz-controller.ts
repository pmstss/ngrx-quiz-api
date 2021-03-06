/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Response, NextFunction } from 'express';
import { QuizMetaAdmin, QuizMetaListItem } from 'ngrx-quiz-common';
import { ApiError } from '../../api/api-error';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { AdminQuizRepo } from './admin-quiz-repo';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaListItem[]> {
        return writeResponse(this.repo.getQuizList(req.tokenData.user), req, res, next);
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaAdmin> {
        return writeResponse(
            this.repo.getQuiz(req.params.quizId, req.tokenData.user),
            req , res, next
        );
    }

    createQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaAdmin> {
        return writeResponse(
            this.repo.createQuiz(req.body, req.tokenData.user),
            req , res, next
        );
    }

    updateQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaAdmin> {
        return writeResponse(
            this.repo.updateQuiz(req.params.quizId, req.body, req.tokenData.user),
            req , res, next
        );
    }

    updateQuizOrder(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        console.log(req.body, req.body.quizIdUp, req.body.quizIdDown);
        return writeResponse(
            this.repo.updateQuizOrder(req.body.quizIdUp, req.body.quizIdDown), req , res, next);
    }

    deleteQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(this.repo.deleteQuiz(req.params.quizId, req.tokenData.user), req , res, next);
    }

    publishQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(
            this.repo.publishQuiz(req.params.quizId, req.tokenData.user)
                .then((success: boolean) => {
                    if (!success) {
                        throw new ApiError('No such quiz', 404);
                    }
                }),
            req , res, next
        );
    }

    unpublishQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(
            this.repo.unpublishQuiz(req.params.quizId, req.tokenData.user)
                .then((success: boolean) => {
                    if (!success) {
                        throw new ApiError('No such quiz', 404);
                    }
                }),
            req , res, next
        );
    }
}
