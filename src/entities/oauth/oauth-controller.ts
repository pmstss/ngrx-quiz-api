import { Request, Response, NextFunction } from 'express';
const fetch = require('node-fetch');
import { User } from 'ngrx-quiz-common';
import { TokenRepo } from '../token/token-repo';
import { TokenUtils } from '../../token/token-utils';
import { AuthRepo } from '../auth/auth-repo';
import { writeErrorResponse } from '../../api/response-writer';
import { ApiError } from '../../api/api-error';
import { BASE_URL, OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET,
    OAUTH_TOKEN_CALLBACK_URL } from '../../consts/consts';

interface TokenInfo {
    name: string;
    email: string;
    picture: string;
}

export class OAuthController {
    constructor(private tokenRepo: TokenRepo, private authRepo: AuthRepo) {}

    generatePassword() {
        let pass;
        do {
            pass = (Math.random() * 1024 * 1024).toString(36).split('.').join('');
        } while (pass.length < 8);
        return pass;
    }

    google(req: Request, res: Response, next: NextFunction) {
        const code = req.query.code;

        if (!code) {
            return writeErrorResponse(res, next, new ApiError('No code in google response', 400));
        }

        const params = new URLSearchParams();
        params.append('code', code);
        params.append('clientId', OAUTH_GOOGLE_CLIENT_ID);
        params.append('clientSecret', OAUTH_GOOGLE_CLIENT_SECRET);
        params.append('redirect_uri', `${BASE_URL}/oauth/google`);
        params.append('grant_type', 'authorization_code');

        fetch('https://www.googleapis.com/oauth2/v4/token', {
            method: 'POST',
            body: params
        })
            .then((response: any) => response.json())
            .then((tokenJsonRes: any) =>
                fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenJsonRes.id_token}`)
            )
            .then((response: any) => response.json())
            .then((tokenInfo: TokenInfo) => this.createUser(tokenInfo))
            .then((user: User) => {
                const token = TokenUtils.createUserToken(user);
                return this.tokenRepo.storeUserToken(user.id, token).then(() => token);
            })
            .then((token: string) =>
                res.redirect(`${OAUTH_TOKEN_CALLBACK_URL}${token}`))
            .catch((err: any) => {
                console.error(err);
                writeErrorResponse(res, next, new ApiError('OAuth Error', 400));
            });
    }

    private createUser(tokenInfo: TokenInfo): Promise<User> {
        return this.authRepo.getUser(tokenInfo.email, 'google').then((user: User) => {
            if (user) {
                return user;
            }

            return this.authRepo.createUser({
                id: null,
                password: this.generatePassword(),
                fullName: tokenInfo.name,
                email: tokenInfo.email,
                admin: false,
                social: 'google'
            });
        });
    }
}
