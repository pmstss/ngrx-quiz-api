import { Response } from 'express';
import { NextFunction } from 'connect';
import { AdminQuizRepo } from '../db/admin-quiz-repo';
import { writeResponse } from '../api/response-writer';
import { ApiRequest } from '../api/api-request';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getQuiz(req.params.quizId), req , res, next);
    }

    createQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.createQuiz(req.body), req , res, next);
    }

    updateQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.updateQuiz(req.params.quizId, req.body), req , res, next);
    }

    updateQuizItemsOrder(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.updateQuizItemsOrder(req.params.quizId, req.body.itemIds), req , res, next);
    }

    deleteQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.deleteQuiz(req.params.quizId), req , res, next);
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
}
