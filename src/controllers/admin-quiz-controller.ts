import { Response } from 'express';
import { NextFunction } from 'connect';
import { AdminQuizRepo } from '../db/admin-quiz-repo';
import { writeRepoResponse } from '../api/response-writer';
import { RequestWithToken } from '../token/request-with-token';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
    }

    getQuiz(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.getQuiz(req.params.quizId), req , res, next);
    }

    createQuiz(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.createQuiz(req.body), req , res, next);
    }

    updateQuiz(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.updateQuiz(req.params.quizId, req.body), req , res, next);
    }

    updateQuizItemsOrder(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(
            this.repo.updateQuizItemsOrder(req.params.quizId, req.body.itemIds), req , res, next);
    }

    deleteQuiz(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.deleteQuiz(req.params.quizId), req , res, next);
    }

    getItem(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.getItem(req.params.itemId), req , res, next);
    }

    createItem(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.createItem(req.query.quizId, req.body), req , res, next);
    }

    updateItem(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.updateItem(req.params.itemId, req.body), req , res, next);
    }

    deleteItem(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.deleteItem(req.params.itemId), req , res, next);
    }
}
