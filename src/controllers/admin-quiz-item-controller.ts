import { Response } from 'express';
import { NextFunction } from 'connect';
import { writeResponse } from '../api/response-writer';
import { ApiRequest } from '../api/api-request';
import { AdminQuizItemRepo } from '../db/admin-quiz-item-repo';

export class AdminQuizItemController {
    constructor(private repo: AdminQuizItemRepo) {
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getItem(req.params.itemId), req , res, next);
    }

    createItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.createItem(req.query.quizId, req.body), req , res, next);
    }

    updateItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.updateItem(req.params.itemId, req.body), req , res, next);
    }

    deleteItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.deleteItem(req.params.itemId), req , res, next);
    }

    updateQuizItemsOrder(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.updateQuizItemsOrder(req.params.quizId, req.body.itemIds), req , res, next);
    }
}
