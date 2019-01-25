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

    deleteQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.deleteQuiz(req.params.quizId), req , res, next);
    }
}
