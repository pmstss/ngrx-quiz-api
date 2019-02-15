/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Response, NextFunction } from 'express';
import { QuizItemAdmin } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { AdminQuizItemRepo } from './admin-quiz-item-repo';

export class AdminQuizItemController {
    constructor(private repo: AdminQuizItemRepo) {
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItemAdmin> {
        return writeResponse(this.repo.getItem(req.params.itemId), req , res, next);
    }

    createItem(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItemAdmin> {
        return writeResponse(this.repo.createItem(req.query.quizId, req.body), req , res, next);
    }

    updateItem(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItemAdmin> {
        return writeResponse(this.repo.updateItem(req.params.itemId, req.body), req , res, next);
    }

    deleteItem(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(this.repo.deleteItem(req.params.itemId), req , res, next);
    }

    updateQuizItemsOrder(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(
            this.repo.updateQuizItemsOrder(req.params.quizId, req.body.itemIdUp, req.body.itemIdDown), req , res, next);
    }
}
