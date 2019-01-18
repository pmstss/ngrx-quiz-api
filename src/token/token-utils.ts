import { Request } from 'express';
import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '../models/user';
import { SECRET_KEY } from '../consts/consts';
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
                    email: user.email
                }
            },
            SECRET_KEY,
            {
                expiresIn: '1m'
            }
        );
    }

    static parseFromRequest(req: Request): string {
        const token = req.headers['authorization'] || req.query.token;
        return token && token.startsWith('Bearer ') ? token.substr('Bearer '.length) : token;
    }

    static verifyCallback(resolve: (tokenData: TokenData) => void, reject: (err: any) => void,
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

    static verify(token: string): Promise<object | string> {
        return new Promise((resolve, reject) => {
            verify(
                token,
                SECRET_KEY,
                TokenUtils.verifyCallback.bind(TokenUtils, resolve, reject)
            );
        });
    }

    static verifyIgnoringExpiration(token: string): Promise<TokenData> {
        return new Promise((resolve, reject) => {
            verify(
                token,
                SECRET_KEY,
                {
                    ignoreExpiration: true
                },
                TokenUtils.verifyCallback.bind(TokenUtils, resolve, reject)
            );
        });
    }
}
