/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';
import { QuizItemChoiceSchema, QuizItemChoiceDoc } from './quiz-item-choice-model';

export interface QuizItemDoc {
    quizId: mongoose.Types.ObjectId;
    question: string;
    randomizeChoices: boolean;
    singleChoice: boolean;
    choices: QuizItemChoiceDoc[];
    order?: number;
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
            default: Math.round(Number.MAX_SAFE_INTEGER / 2),
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
        collection: 'items',
        timestamps: true
    }
);

QuizItemSchema.index({ quizId: 1, order: 1 });

// tslint:disable-next-line variable-name
export const QuizItemModel = mongoose.model<QuizItemMongooseDoc>('QuizItem', QuizItemSchema);
