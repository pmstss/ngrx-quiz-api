import * as mongoose from 'mongoose';
import { QuizItem, QuizItemSchema } from './quiz-item';

export interface Quiz {
    id: string;
    name: string;
    shortName: string;
    description: string;
    descriptionFull: string;
    timeLimit?: number;
    randomizeItems: boolean;
    items: QuizItem[];
}

// tslint:disable-next-line variable-name
export const QuizSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            required: true
        },
        shortName: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            required: true,
            index: {
                unique: true
            }
        },
        description: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            required: true
        },
        descriptionFull: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            required: true
        },
        timeLimit: {
            type: mongoose.SchemaTypes.Number,
            required: true
        },
        randomizeItems: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        }
    },
    {
        collection: 'quizes'
    }
);

// tslint:disable-next-line variable-name
export const QuizModel = mongoose.model('Quiz', QuizSchema);
