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
}

export interface UserDocMongoose extends UserDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const UserSchema = new mongoose.Schema({
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
        trim: true,
        required: true,
        default: false
    },
    social: {
        type: mongoose.SchemaTypes.String,
        trim: true,
        maxlength: 10,
        required: true
    }
});

UserSchema.pre('save', function (next: NextFunction) {
    this.set('password', hashSync(this.get('password'), SALT_ROUNDS));
    next();
});

// tslint:disable-next-line variable-name
export const UserModel = mongoose.model<UserDocMongoose>('User', UserSchema);
