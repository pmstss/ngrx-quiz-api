import { Response } from 'express';
import { NextFunction } from 'connect';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { ItemComment } from './item-comment-model';
import { CommentRepo } from './item-comment-repo';

export class CommentController {
    constructor(private repo: CommentRepo) {
    }

    getComments(req: ApiRequest, res: Response, next: NextFunction):
            Promise<ItemComment[]> {
        return writeResponse(this.repo.getComments(req.params.itemId), req, res, next);
    }

    addComment(req: ApiRequest, res: Response, next: NextFunction): Promise<ItemComment> {
        return writeResponse(
            this.repo.addComment({
                itemId: req.params.itemId,
                userId: req.tokenData.user.id,
                text: req.body.text
            }),
            req, res, next
        );
    }
}
