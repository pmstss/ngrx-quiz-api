import * as mongoose from 'mongoose';
import { QuizItemChoice, QuizItemChoiceSchema, QuizItemChoiceDoc } from './quiz-item-choice-model';

export interface QuizItemUpdate {
    question: string;
    choices: QuizItemChoice[];
    randomizeChoices: boolean;
    singleChoice: boolean;
}

export interface QuizItem extends QuizItemUpdate {
    quizId: string;
    order: number;
    counter: number;
}

export interface QuizItemDoc {
    quizId: mongoose.Types.ObjectId;
    question: string;
    randomizeChoices: boolean;
    singleChoice: boolean;
    choices: QuizItemChoiceDoc[];
    order: number;
    counter: number;
}

export interface QuizItemMongooseDoc extends QuizItemDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
export const QuizItemSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Quiz'
        },
        question: {
            type: mongoose.SchemaTypes.String,
            required: true,
            maxlength: 4096,
            trim: true
        },
        randomizeChoices: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        },
        singleChoice: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        },
        choices: [QuizItemChoiceSchema],
        order: {
            type: mongoose.Schema.Types.Number,
            required: true,
            default: 0,
            select: false
        },
        counter: {
            type: mongoose.Schema.Types.Number,
            required: true,
            default: 0,
            select: false
        }
    },
    {
        collection: 'items'
    }
);

// tslint:disable-next-line variable-name
export const QuizItemModel = mongoose.model<QuizItemMongooseDoc>('QuizItem', QuizItemSchema);
