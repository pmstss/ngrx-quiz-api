/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';

export interface PasswordTokenDoc {
    userId: mongoose.Types.ObjectId;
    token: string;
    used: boolean;
}

export interface PasswordTokenDocMongoose extends PasswordTokenDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const PasswordTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        token: {
            type: mongoose.SchemaTypes.String,
            maxlength: 64,
            required: true
        },
        used: {
            type: mongoose.SchemaTypes.Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);
PasswordTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// tslint:disable-next-line variable-name
export const PasswordTokenModel = mongoose.model<PasswordTokenDocMongoose>('PasswordToken', PasswordTokenSchema);
