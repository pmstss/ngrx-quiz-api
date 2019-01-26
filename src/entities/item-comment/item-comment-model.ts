import * as mongoose from 'mongoose';

export interface ItemComment {
    id: string;
    userName: string;
    date: Date;
    text: string;
}

export interface ItemCommentDoc {
    userId: string;
    itemId: string;
    text: string;
    date?: Date;
}

export interface ItemCommentMongooseDoc extends ItemCommentDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const ItemCommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    itemId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'QuizItem'
    },
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now
    },
    text: {
        type: mongoose.SchemaTypes.String,
        trim: true,
        maxlength: 2048,
        required: true
    }
});

// tslint:disable-next-line variable-name
export const ItemCommentModel =
    mongoose.model<ItemCommentMongooseDoc>('ItemComment', ItemCommentSchema);
