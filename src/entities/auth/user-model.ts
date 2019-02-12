/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';
import { NextFunction } from 'express';
import { hashSync } from 'bcrypt';
import { SALT_ROUNDS } from '../../consts/consts';

export interface UserDoc {
    fullName: string;
    email: string;
    password: string;
    admin: boolean;
    social: string;
    anonymous: boolean;
}

export interface UserDocMongoose extends UserDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: mongoose.SchemaTypes.String,
            maxlength: 64,
            minlength: 5,
            trim: true,
            required: true
        },
        email: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            minlength: 6,
            maxlength: 64,
            required: true,
            index: {
                unique: true
            }
        },
        password: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            minlength: 8,
            maxlength: 64,
            required: true
        },
        admin: {
            type: mongoose.SchemaTypes.Boolean,
            required: true,
            default: false
        },
        social: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 10,
            required: false
        },
        anonymous: {
            type: mongoose.SchemaTypes.Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export function hashPassword(pass: string) {
    return hashSync(pass, SALT_ROUNDS);
}

UserSchema.pre('save', function (next: NextFunction) {
    this.set('password', hashPassword(this.get('password')));
    next();
});

UserSchema.pre('findOneAndUpdate', function (next: NextFunction) {
    this.update({}, { password: hashPassword(this.getUpdate().$set.password) });
    next();
});

// tslint:disable-next-line variable-name
export const UserModel = mongoose.model<UserDocMongoose>('User', UserSchema);
