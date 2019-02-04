import { Response, NextFunction } from 'express';
import { TopScore } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { ScoreRepo } from '../score/score-repo';

export class ScoreController {
    constructor(private repo: ScoreRepo) {
    }

    getTopScores(req: ApiRequest, res: Response, next: NextFunction): Promise<TopScore[]> {
        return writeResponse(this.repo.getTopScores(req.params.quizId), req, res, next);
    }
}
