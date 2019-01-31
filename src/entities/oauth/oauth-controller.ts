import { Request, Response, NextFunction } from 'express';
const fetch = require('node-fetch');
import { User, UserWithPassword } from 'ngrx-quiz-common';
import { TokenRepo } from '../token/token-repo';
import { TokenUtils } from '../../token/token-utils';
import { AuthRepo } from '../auth/auth-repo';
import { writeErrorResponse } from '../../api/response-writer';
import { ApiError } from '../../api/api-error';
import { BASE_URL, OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET,
    OAUTH_TOKEN_CALLBACK_URL,
    OAUTH_GITHUB_CLIENT_ID,
    OAUTH_GITHUB_CLIENT_SECRET} from '../../consts/consts';
import { GitHubTokenInfo, GoogleTokenInfo, OAuthType } from '../token/oauth-token';

interface GoogleAccessResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
}

interface GitHubAccessResponse {
    access_token: string;
    scope: string;
    token_type: string;
}

export class OAuthController {
    constructor(private tokenRepo: TokenRepo, private authRepo: AuthRepo) {}

    google(req: Request, res: Response, next: NextFunction) {
        const code = req.query.code;

        if (!code) {
            return writeErrorResponse(res, next, new ApiError('No code in Google response', 400));
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
            .then((tokenResponse: GoogleAccessResponse) => {
                return fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenResponse.id_token}`);
            })
            .then((response: any) => response.json())
            .then((tokenInfo: GoogleTokenInfo) => this.tokenRepo.storeOauthToken(tokenInfo, OAuthType.GOOGLE))
            .then((user: UserWithPassword) => this.createUser(user))
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

    github(req: Request, res: Response, next: NextFunction) {
        const code = req.query.code;

        if (!code) {
            return writeErrorResponse(res, next, new ApiError('No code in GitHub response', 400));
        }

        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', OAUTH_GITHUB_CLIENT_ID);
        params.append('client_secret', OAUTH_GITHUB_CLIENT_SECRET);
        params.append('redirect_uri', `${BASE_URL}/oauth/github`);

        fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            body: params
        }).then((response: any) => {
            console.log(response);
            return response.text();
        }).then((text: string) => text.split('&').reduce(
            (res: any, item: string) => {
                const [key, value] = item.split('=');
                res[key] = value;
                return res;
            },
            {}
        )).then((tokenResponse: GitHubAccessResponse) =>
            fetch(`https://api.github.com/user?access_token=${tokenResponse.access_token}`)
        )
        .then((response: any) => response.json())
        .then((tokenInfo: GitHubTokenInfo) => this.tokenRepo.storeOauthToken(tokenInfo, OAuthType.GITHUB))
        .then((user: UserWithPassword) => this.createUser(user))
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

    private createUser(user: UserWithPassword): Promise<User> {
        return this.authRepo.getUser(user.email, user.social).then((u: User) => {
            if (u) {
                return u;
            }

            return this.authRepo.createUser(user);
        });
    }
}
