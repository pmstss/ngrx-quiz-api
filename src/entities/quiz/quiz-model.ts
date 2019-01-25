import * as mongoose from 'mongoose';
import { QuizItem } from '../quiz-item/quiz-item-model';

export interface Quiz {
    id: string;
    name: string;
    shortName: string;
    description: string;
    descriptionFull: string;
    randomizeItems: boolean;
    itemIds: string[];
}

export interface QuizAdmin extends Quiz {
    items: QuizItem[];
}

export interface QuizListItem {
    id: string;
    name: string;
    shortName: string;
    description: string;
    descriptionFull: string;
    randomizeItems: boolean;
    totalQuestions: number; // insteadof itemIds
    started: boolean;
    finished: boolean;
}

export interface QuizDoc {
    name: string;
    shortName: string;
    description: string;
    descriptionFull: string;
    randomizeItems: boolean;
}

export interface QuizMongooseDoc extends QuizDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
export const QuizSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 128,
            required: true
        },
        shortName: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            required: true,
            maxlength: 64,
            index: {
                unique: true
            }
        },
        description: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 1024,
            required: true
        },
        descriptionFull: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 2048,
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
export const QuizModel = mongoose.model<QuizMongooseDoc>('Quiz', QuizSchema);
