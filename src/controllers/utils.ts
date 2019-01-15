import { Response } from 'express';
import { NextFunction } from 'connect';

export const handleRepoResult = (repoResult: Promise<any>, res: Response, next: NextFunction) => {
    return repoResult
        .then((data: any) => {
            res.json({
                data,
                success: true
            });
            return res;
        })
        .catch((err: any) => next(err));
};
