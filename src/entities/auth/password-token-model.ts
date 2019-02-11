import * as mongoose from 'mongoose';

export interface PasswordTokenDoc {
    userId: mongoose.Types.ObjectId;
    token: string;
}

export interface PasswordTokenDocMongoose extends PasswordTokenDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const PasswordTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: mongoose.SchemaTypes.String,
        maxlength: 64,
        required: true
    }
}, {
    timestamps: true
});
PasswordTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// tslint:disable-next-line variable-name
export const PasswordTokenModel = mongoose.model<PasswordTokenDocMongoose>('PasswordToken', PasswordTokenSchema);
