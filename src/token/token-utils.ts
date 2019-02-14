/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Request } from 'express';
import { User } from 'ngrx-quiz-common';
import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { JWT_SECRET_KEY, JWT_TTL } from '../consts/consts';
import { TokenData } from './token-data';
import { ApiError } from '../api/api-error';

export class TokenUtils {
    private constructor() {
    }

    static createUserToken(user: User): string {
        return sign(
            {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    admin: user.admin,
                    anonymous: user.anonymous,
                    social: user.social
                }
            },
            JWT_SECRET_KEY,
            {
                expiresIn: JWT_TTL
            }
        );
    }

    static parseFromRequest(req: Request): string {
        const token = req.headers['authorization'] || req.query.token;
        return token && token.startsWith('Bearer ') ? token.substr('Bearer '.length) : token;
    }

    private static verifyCallback(resolve: (tokenData: TokenData) => void, reject: (err: any) => void,
                                  err: VerifyErrors, tokenData: TokenData) {
        if (err) {
            reject(err);
        } else {
            if (!tokenData || !tokenData.user) {
                reject(new ApiError('Invalid token format', 422));
            } else {
                resolve(tokenData);
            }
        }
    }

    static verify(token: string): Promise<TokenData> {
        return new Promise((resolve, reject) => {
            verify(
                token,
                JWT_SECRET_KEY,
                TokenUtils.verifyCallback.bind(TokenUtils, resolve, reject)
            );
        });
    }

    static verifyIgnoringExpiration(token: string): Promise<TokenData> {
        return new Promise((resolve, reject) => {
            verify(
                token,
                JWT_SECRET_KEY,
                {
                    ignoreExpiration: true
                },
                TokenUtils.verifyCallback.bind(TokenUtils, resolve, reject)
            );
        });
    }
}
