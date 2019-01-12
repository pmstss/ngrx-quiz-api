import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { AdminQuizRepo } from './admin-quiz-repo';
import { writeSuccessCallback } from './utils';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
    }

    getQuiz(req: Request, res: Response, next: NextFunction) {
        return this.repo.getQuiz(req.params.quizId)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    createQuiz(req: Request, res: Response, next: NextFunction) {
        return this.repo.createQuiz(req.body)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    updateQuiz(req: Request, res: Response, next: NextFunction) {
        return this.repo.updateQuiz(req.params.quizId, req.body)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    deleteQuiz(req: Request, res: Response, next: NextFunction) {
        return this.repo.deleteQuiz(req.params.quizId)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    getItem(req: Request, res: Response, next: NextFunction) {
        return this.repo.getItem(req.params.itemId)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    createItem(req: Request, res: Response, next: NextFunction) {
        return this.repo.createItem(req.query.quizId, req.body)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    updateItem(req: Request, res: Response, next: NextFunction) {
        return this.repo.updateItem(req.params.itemId, req.body)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }

    deleteItem(req: Request, res: Response, next: NextFunction) {
        return this.repo.deleteItem(req.params.itemId)
            .then(writeSuccessCallback(res))
            .catch((err: any) => next(err));
    }
}
