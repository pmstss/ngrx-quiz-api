import { Response, NextFunction } from 'express';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { CommentRepo } from './item-comment-repo';
import { ItemComment } from './item-comment-model';

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
