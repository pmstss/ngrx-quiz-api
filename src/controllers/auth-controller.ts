import * as mongoose from 'mongoose';
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
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
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
                        token: AuthController.createToken(req, user)
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
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

// TODO ### REMOVE temp implementation!
    resetPass(req: Request, res: Response, next: NextFunction) {
        return UserModel.findOne(
            {
                email: req.body.email
            })
            .then((user: mongoose.Document) => {
                if (user) {
                    user.set('password', '12345');
                    return user.save().then(() => {
                        res.json({
                            success: true,
                            data: user
                        });
                    });
                }

                res.status(404).json({
                    success: false,
                    message: 'No such user'
                });
            })
            .catch((err: any) => next(err));
    }
}
