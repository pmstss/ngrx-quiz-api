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
