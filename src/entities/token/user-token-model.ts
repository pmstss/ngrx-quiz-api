/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';

export interface UserToken {
    userId: string;
    token: string;
}

export interface UserTokenMongooseDoc extends UserToken, mongoose.Document {
}

// tslint:disable-next-line variable-name
const UserTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
            index: <mongoose.SchemaTypeOpts.IndexOpts>{
                unique: true
            }
        },
        token: {
            type: mongoose.SchemaTypes.String,
            maxlength: 4096,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// tslint:disable-next-line variable-name
export const UserTokenModel = mongoose.model<UserTokenMongooseDoc>('UserToken', UserTokenSchema);
