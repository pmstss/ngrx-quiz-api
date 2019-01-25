import * as mongoose from 'mongoose';

export interface ItemComment {
    userId: string;
    itemId: string;
    text: string;
    date?: Date;
}

export interface ItemCommentDoc extends ItemComment, mongoose.Document {
}

export interface ItemCommentResponse {
    id: string;
    userName: string;
    date: Date;
    text: string;
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
        maxlength: 2048, // TODO ### introduce constrain for other strings
        required: true
    }
});

// tslint:disable-next-line variable-name
export const ItemCommentModel = mongoose.model<ItemCommentDoc>('ItemComment', ItemCommentSchema);
