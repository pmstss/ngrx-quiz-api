import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { UserModel, User, UserWithPassword } from '../models/user';
import { NextFunction } from 'connect';
import { compareSync } from 'bcrypt';
import { AuthRepo } from '../db/auth-repo';
import { TokenService } from '../token/token-service';
import { RequestWithToken } from '../token/request-with-token';
import { writeSuccessResponse, writeRepoResponse } from '../api/response-writer';
import { ApiError } from '../api/api-error';

export class AuthController {
    constructor(private repo: AuthRepo) {}

    login(req: RequestWithToken, res: Response, next: NextFunction) {
        return writeRepoResponse(
            this.repo.getUser(req.body.email).then((user: UserWithPassword) => {
                if (user && compareSync(req.body.password, user.password)) {
                    req.tokenService = TokenService.createForUser(user);
                    return {};
                }

                throw new ApiError('Invalid credentials', 401);
            }),
            req, res, next
        );
    }

    logout(req: RequestWithToken, res: Response, next: NextFunction) {
        writeSuccessResponse(req, res, next, null, true);
    }

    register(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(
            this.repo.createUser({
                id: null,
                email: req.body.email,
                fullName: req.body.fullName,
                password: req.body.password
            })
            .then(() => this.login(req, res, next)),
            req, res, next);
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
