/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';

export interface MailResultDoc {
    userId: mongoose.Types.ObjectId;
    result: object;
}

export interface MailResultDocMongoose extends MailResultDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const MailResultSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
            default: null
        },
        result: {
            type: mongoose.SchemaTypes.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// tslint:disable-next-line variable-name
export const MailResultModel = mongoose.model<MailResultDocMongoose>('MailResult', MailResultSchema);
