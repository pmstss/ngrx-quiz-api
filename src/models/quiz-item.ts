import * as mongoose from 'mongoose';
import { QuizItemChoice, QuizItemChoiceSchema } from './quiz-item-choice';
import { QuizModel, QuizSchema } from './quiz';

export interface QuizItem {
    id?: string;
    quizId: mongoose.Types.ObjectId;
    question: string;
    choices: QuizItemChoice[];
    randomizeChoices: boolean;
    singleChoice: boolean;
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
        counter: {
            type: mongoose.Schema.Types.Number,
            required: true,
            default: 0,
            select: false
        }
    },
    {
        collection: 'items'/*,
        toObject: {
            // virtuals: false,
            transform: (doc, ret) => {
                console.log('### toObject - doc: %o, ret: %o', doc, ret);
                delete ret.__v;
            }
        },
        toJSON: {
            // virtuals: false,
            transform: (doc, ret) => {
                console.log('### toObject - doc: %o, ret: %o', doc, ret);
                delete ret.__v;
            }
        }*/
    }
);

// tslint:disable-next-line variable-name
export const QuizItemModel = mongoose.model('QuizItem', QuizItemSchema);
