import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { UserModel, UserWithPassword } from '../models/user';
import { NextFunction } from 'connect';
import { compareSync } from 'bcrypt';
import { AuthRepo } from '../db/auth-repo';
import { TokenUtils } from '../token/token-utils';
import { ApiRequest } from '../api/api-request';
import { writeResponse } from '../api/response-writer';
import { ApiError } from '../api/api-error';
import { TokenRepo } from '../db/token-repo';
import { TokenData } from '../token/token-data';

export class AuthController {
    constructor(private repo: AuthRepo, private tokenRepo: TokenRepo) {}

    login(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.getUser(req.body.email).then((user: UserWithPassword) => {
                if (user && compareSync(req.body.password, user.password)) {
                    const token = TokenUtils.createUserToken(user);
                    return this.tokenRepo.storeUserToken(user.id, token)
                        .then(() => ({ token }));
                }

                throw new ApiError('Invalid credentials', 401);
            }),
            req, res, next
        );
    }

    logout(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            TokenUtils.verifyIgnoringExpiration(TokenUtils.parseFromRequest(req))
                .then(tokenData =>
                    this.tokenRepo.removeUserToken(tokenData.user.id))
                .then(() => null),
            req, res, next
        );
    }

    register(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.createUser({
                id: null,
                email: req.body.email,
                fullName: req.body.fullName,
                password: req.body.password
            })
            .then(() => this.login(req, res, next)),
            req, res, next);
    }

    refreshToken(req: ApiRequest, res: Response, next: NextFunction) {
        const token = req.body.token;

        writeResponse(
            TokenUtils.verifyIgnoringExpiration(token)
                .then(tokenData =>
                    this.tokenRepo.exists(tokenData.user.id, token)
                        .then(exists => ([tokenData, exists]))
                )
                .then(([tokenData, exists]: [TokenData, boolean]) => {
                    if (exists) {
                        const token = TokenUtils.createUserToken(tokenData.user);
                        return this.tokenRepo.storeUserToken(tokenData.user.id, token)
                            .then(() => ({ token }));
                    }

                    throw new ApiError('Invalid token', 401);
                }),
            req, res, next
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
