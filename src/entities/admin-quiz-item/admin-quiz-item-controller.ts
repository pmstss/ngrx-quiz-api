import { Response, NextFunction } from 'express';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { AdminQuizItemRepo } from './admin-quiz-item-repo';
import { QuizItem } from '../quiz-item/quiz-item-model';

export class AdminQuizItemController {
    constructor(private repo: AdminQuizItemRepo) {
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItem> {
        return writeResponse(this.repo.getItem(req.params.itemId), req , res, next);
    }

    createItem(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItem> {
        return writeResponse(this.repo.createItem(req.query.quizId, req.body), req , res, next);
    }

    updateItem(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItem> {
        return writeResponse(this.repo.updateItem(req.params.itemId, req.body), req , res, next);
    }

    deleteItem(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(this.repo.deleteItem(req.params.itemId), req , res, next);
    }

    updateQuizItemsOrder(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(
            this.repo.updateQuizItemsOrder(req.params.quizId, req.body.itemIds), req , res, next);
    }
}
