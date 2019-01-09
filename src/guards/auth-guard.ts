import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(
        <string>req.headers['x-access-token'],
        req.app.get('secretKey'),
        (err: jwt.VerifyErrors, decoded: {[key: string]: any}) => {
            if (err) {
                res.json({
                    status: 'error',
                    message: err.message,
                    data: null
                });
            } else {
                // add user id to request
                req.body.userId = decoded.id;
                next();
            }
        }
    );
};
