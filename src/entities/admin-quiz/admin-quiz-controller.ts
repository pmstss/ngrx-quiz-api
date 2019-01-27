import { Response, NextFunction } from 'express';
import { QuizMetaAdmin } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { AdminQuizRepo } from './admin-quiz-repo';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaAdmin> {
        return writeResponse(this.repo.getQuiz(req.params.quizId), req , res, next);
    }

    createQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaAdmin> {
        return writeResponse(this.repo.createQuiz(req.body), req , res, next);
    }

    updateQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaAdmin> {
        return writeResponse(this.repo.updateQuiz(req.params.quizId, req.body), req , res, next);
    }

    deleteQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(this.repo.deleteQuiz(req.params.quizId), req , res, next);
    }
}
