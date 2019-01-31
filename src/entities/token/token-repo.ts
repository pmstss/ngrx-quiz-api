import { User } from 'ngrx-quiz-common';
import { UserTokenModel, UserTokenMongooseDoc } from './user-token';
import { OAuthTokenModel, GitHubTokenInfo, GoogleTokenInfo, OAuthType } from './oauth-token';

export class TokenRepo {
    exists(userId: string, token: string): Promise<boolean> {
        return UserTokenModel
            .findOne({
                token,
                userId
            })
            .exec()
            .then((res: UserTokenMongooseDoc) => !!res);
    }

    storeUserToken(userId: string, token: string): Promise<boolean> {
        return UserTokenModel.findOneAndUpdate(
            {
                userId
            },
            {
                $set: {
                    token
                }
            },
            {
                upsert: true
            }
        ).exec()
        .then(() => true);
    }

    removeUserToken(userId: string): Promise<boolean>  {
        return UserTokenModel.findByIdAndRemove(userId).exec()
            .then(() => true);
    }

    private generatePassword() {
        let pass;
        do {
            pass = (Math.random() * 1024 * 1024).toString(36).split('.').join('');
        } while (pass.length < 8);
        return pass;
    }

    storeOauthToken(tokenInfo: GitHubTokenInfo | GoogleTokenInfo, social: OAuthType): Promise<User> {
        return OAuthTokenModel.create({ token: tokenInfo }).then(() => {
            const email = tokenInfo.email || `${(tokenInfo as GitHubTokenInfo).login}@github.com`;
            const fullName = tokenInfo.name || (tokenInfo as GitHubTokenInfo).login;

            return {
                email,
                fullName,
                social,
                id: null,
                password: this.generatePassword(),
                admin: false
            };
        });
    }
}
