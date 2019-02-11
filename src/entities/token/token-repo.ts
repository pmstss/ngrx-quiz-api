import { User } from 'ngrx-quiz-common';
import { UserTokenModel, UserTokenMongooseDoc } from './user-token';
import { OAuthTokenModel, GitHubTokenInfo, GoogleTokenInfo, OAuthType } from './oauth-token';
import { RandomUtils } from '../../utils/random';

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

    storeOauthToken(tokenInfo: GitHubTokenInfo | GoogleTokenInfo, social: OAuthType): Promise<User> {
        return OAuthTokenModel.create({ token: tokenInfo }).then(() => {
            const email = tokenInfo.email || `${(tokenInfo as GitHubTokenInfo).login}@github.com`;
            const fullName = tokenInfo.name || (tokenInfo as GitHubTokenInfo).login;

            return {
                email,
                fullName,
                social,
                id: null,
                password: RandomUtils.generateAlfaNum(12, 32),
                admin: false,
                anonymous: false
            };
        });
    }
}
