import { Request, Response, NextFunction } from 'express';
import { TokenUtils } from './token-utils';
import { VerifyErrors } from 'jsonwebtoken';
import { writeErrorResponse } from '../api/response-writer';
import { ApiRequest } from '../api/api-request';
import { TokenData } from './token-data';

export const tokenGuard = (req: Request, res: Response, next: NextFunction) => {
    TokenUtils.verify(TokenUtils.parseFromRequest(req))
        .then((tokenData: TokenData) => {
            (req as ApiRequest).tokenData = tokenData;
            // validation over db (TokenRepo) can be done here, but it's additional db load;
            // for now deliberately allowing possibly stolen token to be used
            // in short time before its expiration; otherwise no need to use JWT at all here
            next();
        })
        .catch((err: VerifyErrors) => writeErrorResponse(res, next, err.message, 401));
};
