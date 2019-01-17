import { Request, Response, NextFunction } from 'express';
import { TokenService } from './token-service';
import { VerifyErrors } from 'jsonwebtoken';
import { TokenData } from './token-data';
import { RequestWithToken } from './request-with-token';
import { writeErrorResponse } from '../api/response-writer';

export const tokenGuard = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers);
    TokenService.verify(<string>req.headers['authorization'])
        .then((decoded: TokenData) => {
            (req as RequestWithToken).tokenService = new TokenService(decoded);
            next();
        })
        .catch((err: VerifyErrors) => writeErrorResponse(res, next, err.message, 401));
};
