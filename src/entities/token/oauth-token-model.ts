/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';

export interface GoogleTokenInfo {
    name: string;
    email: string;
    picture: string;
}

export interface GitHubTokenInfo {
    name: string;
    login: string;
    location: string;
    email: string;
    bio: string;
}

export enum OAuthType {
    GOOGLE = 'google',
    GITHUB = 'github'
}

export interface OAuthToken {
    token: { [key: string]: any };
}

export interface OAuthTokenMongooseDoc extends OAuthToken, mongoose.Document {
}

// tslint:disable-next-line variable-name
const OAuthTokenSchema = new mongoose.Schema(
    {
        token: {
            type: mongoose.SchemaTypes.Mixed,
            maxlength: 8192,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// tslint:disable-next-line variable-name
export const OAuthTokenModel = mongoose.model<OAuthTokenMongooseDoc>('OAuthToken', OAuthTokenSchema);
