import * as mongoose from 'mongoose';

export interface ItemCommentDoc {
    userId: string;
    itemId: string;
    text: string;
    createdAt?: Date;
}

export interface ItemCommentMongooseDoc extends ItemCommentDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
const ItemCommentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        itemId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'QuizItem'
        },
        text: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 2048,
            required: true
        }
    },
    {
        timestamps: true
    }
);
ItemCommentSchema.index({ itemId: 1, createdAt: -1 });

// tslint:disable-next-line variable-name
export const ItemCommentModel =
    mongoose.model<ItemCommentMongooseDoc>('ItemComment', ItemCommentSchema);
