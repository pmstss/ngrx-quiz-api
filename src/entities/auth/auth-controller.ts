import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcrypt';
import { UserWithPassword, User } from 'ngrx-quiz-common';
import { writeResponse, writeErrorResponse } from '../../api/response-writer';
import { ApiError } from '../../api/api-error';
import { AuthRepo } from './auth-repo';
import { TokenRepo } from '../token/token-repo';
import { TokenUtils } from '../../token/token-utils';
import { TokenData, TokenResponse } from '../../token/token-data';
import { verifyRecaptcha } from '../../utils/recaptcha';
import { RandomUtils } from '../../utils/random';
import { Mailer } from '../../mail/mailer';
import { MailResultRepo } from '../mail/mail-result-repo';
import { BanWords } from '../../utils/ban-words';

export class AuthController {
    constructor(private repo: AuthRepo, private tokenRepo: TokenRepo) {}

    login(req: Request, res: Response, next: NextFunction): Promise<TokenResponse> {
        if (!req.body.captchaToken || !req.body.email || !req.body.password) {
            return writeErrorResponse(res, next, new ApiError('Invalid parameters', 422));
        }

        return writeResponse(
            verifyRecaptcha(req.body.captchaToken).then((valid: boolean) => {
                if (!valid) {
                    throw new ApiError('Invalid captcha', 403);
                }
                return this.loginAux(req.body.email, req.body.password);
            }),
            req, res, next
        );
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
        if (!req.body.captchaToken || !req.body.email || !req.body.password || !req.body.fullName) {
            return writeErrorResponse(res, next, new ApiError('Invalid parameters', 422));
        }

        if (BanWords.isInsulting(req.body.fullName)) {
            return writeErrorResponse(res, next, new ApiError('Please be polite or banned', 422));
        }

        return writeResponse(
            verifyRecaptcha(req.body.captchaToken).then((valid: boolean) => {
                if (!valid) {
                    throw new ApiError('Invalid captcha', 403);
                }

                return this.repo.createUser({
                    id: null,
                    email: req.body.email,
                    fullName: req.body.fullName,
                    password: req.body.password,
                    admin: false,
                    social: null,
                    anonymous: false
                }).then(() => this.loginAux(req.body.email, req.body.password));
            }),
            req, res, next
        );
    }

    refreshToken(req: Request, res: Response, next: NextFunction): Promise<TokenResponse> {
        if (!req.body.token) {
            return writeErrorResponse(res, next, new ApiError('Missing token', 403));
        }

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
        if (!req.body.captchaToken) {
            return writeErrorResponse(res, next, new ApiError('Invalid parameters', 422));
        }

        return writeResponse(
            verifyRecaptcha(req.body.captchaToken).then((valid: boolean) => {
                if (!valid) {
                    throw new ApiError('Invalid captcha', 403);
                }

                const email = `anonym-${RandomUtils.generateAlfaNum(12, 32)}@rankme.pro`;
                return this.repo.createUser({
                    email,
                    id: null,
                    fullName: 'Anonymous',
                    password: RandomUtils.generateAlfaNum(12, 32),
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

    requestResetPassToken(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        if (!req.body.captchaToken || !req.body.email) {
            return writeErrorResponse(res, next, new ApiError('Invalid parameters', 422));
        }

        return writeResponse(
            verifyRecaptcha(req.body.captchaToken).then((valid: boolean) => {
                if (!valid) {
                    throw new ApiError('Invalid captcha', 403);
                }

                const token =  RandomUtils.generateAlfaNum(32, 32);
                return this.repo.upsertPasswordToken(req.body.email, token).then((user: User) => {
                    if (!user) {
                        throw new ApiError('No such user', 403);    // TODO do not expose this info?
                    }
                    return Mailer.getInstance().sendPasswordReset(user.fullName, req.body.email, token)
                        .then((mailResult: any) => {
                            return MailResultRepo.insertMailResult(user.id, mailResult);
                        });
                });
            }),
            req, res, next
        );
    }

    resetPass(req: Request, res: Response, next: NextFunction) {
        if (!req.body.token || !req.body.password) {
            return writeErrorResponse(res, next, new ApiError('Invalid parameters', 422));
        }

        return writeResponse(
            this.repo.updatePassword(req.body.token, req.body.password).then((success: boolean) => {
                if (!success) {
                    throw new ApiError('No such user', 403);    // TODO do not expose this info?
                }
                return success;
            }),
            req, res, next
        );
    }
}
