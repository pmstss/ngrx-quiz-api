/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Response, NextFunction } from 'express';
import { Comment } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { writeResponse } from '../../api/response-writer';
import { BanWords } from '../../utils/ban-words';
import { CommentRepo } from './item-comment-repo';

export class CommentController {
    constructor(private repo: CommentRepo) {
    }

    getComments(req: ApiRequest, res: Response, next: NextFunction):
            Promise<Comment[]> {
        const offset = +req.query.offset ? +req.query.offset : 0;
        return writeResponse(this.repo.getComments(req.params.itemId, offset), req, res, next);
    }

    addComment(req: ApiRequest, res: Response, next: NextFunction): Promise<Comment> {
        return writeResponse(
            this.repo.addComment({
                itemId: req.params.itemId,
                userId: req.tokenData.user.id,
                text: BanWords.clean(req.body.text)
            }),
            req, res, next
        );
    }
}
