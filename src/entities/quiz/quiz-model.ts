/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';

export interface QuizDoc {
    name: string;
    shortName: string;
    description: string;
    descriptionFull: string;
    randomizeItems: boolean;
    order?: number;
    userId: string;
    published: boolean;
    public: boolean;
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
        },
        order: {
            type: mongoose.SchemaTypes.Number,
            required: true,
            default: Math.round(Number.MAX_SAFE_INTEGER / 2)
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        published: {
            type: mongoose.SchemaTypes.Boolean,
            required: true,
            default: false
        },
        public: {
            type: mongoose.SchemaTypes.Boolean,
            required: true,
            default: true
        }
    },
    {
        collection: 'quizes',
        timestamps: true
    }
);

// tslint:disable-next-line variable-name
export const QuizModel = mongoose.model<QuizMongooseDoc>('Quiz', QuizSchema);
