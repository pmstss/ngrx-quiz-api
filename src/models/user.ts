import { NextFunction } from 'express';
import { hashSync } from 'bcrypt';
import * as mongoose from 'mongoose';
import { SALT_ROUNDS } from '../consts/consts';

export interface User {
    id: string;
    fullName: string;
    email: string;
    admin: boolean;
}

export interface UserWithPassword extends User {
    password: string;
}

// tslint:disable-next-line variable-name
const UserSchema = new mongoose.Schema({
    fullName: {
        type: mongoose.SchemaTypes.String,
        trim: true,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: mongoose.SchemaTypes.String,
        trim: true,
        required: true
    },
    admin: {
        type: mongoose.SchemaTypes.Boolean,
        trim: true,
        required: true,
        default: false
    }
});

UserSchema.pre('save', function (next: NextFunction) {
    this.set('password', hashSync(this.get('password'), SALT_ROUNDS));
    next();
});

// tslint:disable-next-line variable-name
export const UserModel = mongoose.model('User', UserSchema);
