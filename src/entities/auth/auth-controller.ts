import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcrypt';
import { UserWithPassword } from 'ngrx-quiz-common';
import { writeResponse } from '../../api/response-writer';
import { ApiError } from '../../api/api-error';
import { AuthRepo } from './auth-repo';
import { TokenRepo } from '../token/token-repo';
import { TokenUtils } from '../../token/token-utils';
import { TokenData, TokenResponse } from '../../token/token-data';
import { UserModel } from './user-model';
import { verifyRecaptcha } from './recaptcha';

export class AuthController {
    constructor(private repo: AuthRepo, private tokenRepo: TokenRepo) {}

    login(req: Request, res: Response, next: NextFunction): Promise<TokenResponse> {
        return writeResponse(this.loginAux(req.body.email, req.body.password), req, res, next);
    }

    private loginAux(email: string, password: string): Promise<TokenResponse> {
        return this.repo.getUser(email).then((user: UserWithPassword) => {
            if (user && compareSync(password, user.password)) {
                const token = TokenUtils.createUserToken(user);
                return this.tokenRepo.storeUserToken(user.id, token)
                    .then(() => ({ token }));
            }

            throw new ApiError('Invalid credentials', 401);
        });
    }

    logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        return writeResponse(
            TokenUtils.verifyIgnoringExpiration(TokenUtils.parseFromRequest(req))
                .then(tokenData =>
                    this.tokenRepo.removeUserToken(tokenData.user.id))
                .then(() => null)
                .catch(() => {
                    console.warn('Invalid token for user'); // TODO log somewhere?
                }),
            req, res, next
        );
    }

    register(req: Request, res: Response, next: NextFunction): Promise<TokenResponse> {
        return writeResponse(
            this.repo.createUser({
                id: null,
                email: req.body.email,
                fullName: req.body.fullName,
                password: req.body.password,
                admin: false,
                social: null,
                anonymous: false
            }).then(() => this.loginAux(req.body.email, req.body.password)),
            req, res, next
        );
    }

    refreshToken(req: Request, res: Response, next: NextFunction): Promise<TokenResponse> {
        const token = req.body.token;
        return writeResponse(
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

                    throw new ApiError('Invalid token', 403);
                }),
            req, res, next
        );
    }

    anonymousLogin(req: Request, res: Response, next: NextFunction): Promise<TokenResponse> {
        return writeResponse(
            verifyRecaptcha(req.body.captchaToken).then((valid: boolean) => {
                if (!valid) {
                    throw new ApiError('Invalid captcha', 403);
                }

                const email = `anonym${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}@rankme.pro`;
                return this.repo.createUser({
                    email,
                    id: null,
                    fullName: 'Anonymous',
                    password: 'anonymous',
                    admin: false,
                    social: null,
                    anonymous: true
                })
                .then(() => {
                    return this.repo.getUser(email);
                })
                .then((user: UserWithPassword) => {
                    const token = TokenUtils.createUserToken(user);
                    return this.tokenRepo.storeUserToken(user.id, token)
                        .then(() => ({ token }));
                });
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
