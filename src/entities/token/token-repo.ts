import * as mongoose from 'mongoose';
import { UserTokenModel, UserTokenMongooseDoc } from './user-token';

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
}
