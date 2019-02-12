import { Response, NextFunction } from 'express';
import { QuizMetaAdmin } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { AdminQuizRepo } from './admin-quiz-repo';
import { ApiError } from '../../api/api-error';

export class AdminQuizController {
    constructor(private repo: AdminQuizRepo) {
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
