import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(
        <string>req.headers['x-access-token'],
        req.app.get('secretKey'),
        (err: jwt.VerifyErrors, decoded: {[key: string]: any}) => {
            if (err) {
                res.json({
                    success: false,
                    tokenError: true,
                    message: err.message
                });
            } else {
                req.body.tokenData = decoded;
                next();
            }
        }
    );
};
