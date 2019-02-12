/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';

export interface QuizItemChoiceDoc {
    counter: number;
    text: string;
    explanation: string;
    correct: boolean;
}

export interface QuizItemChoiceMongooseDoc extends QuizItemChoiceDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
export const QuizItemChoiceSchema = new mongoose.Schema(
    {
        text: {
            type: mongoose.Schema.Types.String,
            maxlength: 1024,
            required: true,
            trim: true
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
    },
    {
        timestamps: true
    }
);
