import { Request, Response } from 'express';
import { UserModel, User } from '../models/user';
import { NextFunction } from 'connect';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export class AuthController {
    private static createToken(req: Request, user: User) {
        console.log('### sec: %o, id: %o', req.app.get('secretKey'), user._id);
        return sign(
            {
                id: user._id
            },
            req.app.get('secretKey'),
            {
                expiresIn: '1d'
            }
        );
    }

    login(req: Request, res: Response, next: NextFunction) {
        return UserModel.findOne({ email: req.body.email }, (err: any, user: User) => {
            if (err) {
                next(err);
            } else {
                if (user && compareSync(req.body.password, user.password)) {
                    res.json({
                        success: true,
                        token: AuthController.createToken(req, user),
                        data: user
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Invalid credentials',
                        data: null
                    });
                }
            }
        });
    }

    logout(req: Request, res: Response) {
        res.send({ success: true });
    }

    register(req: Request, res: Response, next: NextFunction) {
        UserModel.create(
            {
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password
            },
            (err: any, user: User) => {
                if (err) {
                    console.log(err);
                    res.status(400).send({ success: false, message: err.message });
                } else {
                    res.json({
                        success: true,
                        token: AuthController.createToken(req, user),
                        data: user
                    });
                }
            }
        );
    }

    resetPass(req: Request, res: Response, next: NextFunction) {
        return UserModel.findOne({ email: req.body.email }, (err: any, user: User) => {
            if (err) {
                next(err);
            } else {
                // TODO ### temp!
                if (user) {
                    res.json({
                        success: true,
                        data: user
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'No such user',
                        data: null
                    });
                }
            }
        });
    }
}
