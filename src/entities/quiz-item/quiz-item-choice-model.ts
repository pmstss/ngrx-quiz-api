import * as mongoose from 'mongoose';

export interface QuizItemChoice {
    id: string;
    counter: number;
    text: string;
    explanation: string;
    correct: boolean;
}

export interface QuizItemChoiceDoc {
    counter: number;
    text: string;
    explanation: string;
    correct: boolean;
}

export interface QuizItemChoiceMongooseDoc extends QuizItemChoiceDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
export const QuizItemChoiceSchema = new mongoose.Schema({
    text: {
        type: mongoose.Schema.Types.String,
        maxlength: 1024,
        required: true,
        trim: true,
        index: {
            unique: true
        }
    },
    explanation: {
        type: mongoose.Schema.Types.String,
        maxlength: 1024,
        required: false,
        trim: true
    },
    correct: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    counter: {
        type: mongoose.Schema.Types.Number,
        required: true,
        default: 0
    }
});
