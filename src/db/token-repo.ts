import * as mongoose from 'mongoose';
import { UserTokenModel } from '../models/user-token';

export class TokenRepo {
    exists(userId: string, token: string): Promise<boolean> {
        return UserTokenModel
            .findOne({
                token,
                userId
            })
            .exec()
            .then((res: mongoose.Document) => {
                return !!res;
            });
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
