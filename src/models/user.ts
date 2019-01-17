import { NextFunction } from 'express';
import { hashSync } from 'bcrypt';
import * as mongoose from 'mongoose';

const saltRounds = 3;

export interface User {
    id: string;
    fullName: string;
    email: string;
}

export interface UserWithPassword extends User {
    password: string;
}

// tslint:disable-next-line variable-name
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
});

UserSchema.pre('save', function (next: NextFunction) {
    this.set('password', hashSync(this.get('password'), saltRounds));
    next();
});

// tslint:disable-next-line variable-name
export const UserModel = mongoose.model('User', UserSchema);
