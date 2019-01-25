import * as mongoose from 'mongoose';

export interface QuizItemChoice {
    id: string;
    counter: number;
    text: string;
    explanation: string;
    correct: boolean;
}

// tslint:disable-next-line variable-name
export const QuizItemChoiceSchema = new mongoose.Schema({
    text: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    explanation: {
        type: mongoose.Schema.Types.String,
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