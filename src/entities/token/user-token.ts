import * as mongoose from 'mongoose';

export interface UserToken {
    userId: string;
    token: string;
}

// tslint:disable-next-line variable-name
const UserTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        index: <mongoose.SchemaTypeOpts.IndexOpts>{
            unique: true
        }
    },
    token: {
        type: String,
        trim: true,
        required: true
    }
});

// tslint:disable-next-line variable-name
export const UserTokenModel = mongoose.model('UserToken', UserTokenSchema);
