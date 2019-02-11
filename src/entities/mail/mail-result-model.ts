import * as mongoose from 'mongoose';

export interface MailResultDoc {
    userId: mongoose.Types.ObjectId;
    result: object;
}

export interface MailResultDocMongoose extends MailResultDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const MailResultSchema = new mongoose.Schema({
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
});

// tslint:disable-next-line variable-name
export const MailResultModel = mongoose.model<MailResultDocMongoose>('MailResult', MailResultSchema);
