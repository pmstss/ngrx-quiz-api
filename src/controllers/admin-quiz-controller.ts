import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { AdminQuizRepo } from './admin-quiz-repo';
import { handleRepoResult } from './utils';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
    }

    getQuiz(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.getQuiz(req.params.quizId), res, next);
    }

    createQuiz(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.createQuiz(req.body), res, next);
    }

    updateQuiz(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.updateQuiz(req.params.quizId, req.body), res, next);
    }

    updateQuizItemsOrder(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(
            this.repo.updateQuizItemsOrder(req.params.quizId, req.body.itemIds), res, next);
    }

    deleteQuiz(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.deleteQuiz(req.params.quizId), res, next);
    }

    getItem(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.getItem(req.params.itemId), res, next);
    }

    createItem(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.createItem(req.query.quizId, req.body), res, next);
    }

    updateItem(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.updateItem(req.params.itemId, req.body), res, next);
    }

    deleteItem(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.deleteItem(req.params.itemId), res, next);
    }
}
