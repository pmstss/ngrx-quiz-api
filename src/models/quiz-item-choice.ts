import * as mongoose from 'mongoose';

export interface QuizItemChoice {
    _id?: string;
    id?: string;
    counter: number;
    text: string;
    explanation: string;
    correct: boolean;
}

// tslint:disable-next-line variable-name
export const QuizItemChoiceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    explanation: {
        type: mongoose.Schema.Types.String,
        required: true,
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
