/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';
import { QuizItemAdmin, QuizItemChoice } from 'ngrx-quiz-common';
import { QuizItemModel, QuizItemDoc, QuizItemMongooseDoc } from '../quiz-item/quiz-item-model';
import { ApiError } from '../../api/api-error';
import { UpdateResult } from '../mongo-types';

export class AdminQuizItemRepo {
    getItem(itemId: string): Promise<QuizItemAdmin> {
        return QuizItemModel
            .aggregate()
            .match({
                _id: mongoose.Types.ObjectId(itemId)
            })
            .addFields({
                id: '$_id',
                choices: {
                    $map: {
                        input: '$choices',
                        as: 'x',
                        in: {
                            $mergeObjects: ['$$x', { id: '$$x._id' }]
                        }
                    }
                }
            })
            .project({
                _id: 0,
                __v: 0,
                'choices._id': 0
            })
            .exec()
            .then((res: QuizItemAdmin[]) => {
                if (res.length) {
                    return res[0];
                }
                throw new ApiError('No such item', 404);
            });
    }

    createItem(quizId: string, item: QuizItemAdmin): Promise<QuizItemAdmin> {
        return QuizItemModel.create(<QuizItemDoc>{
            quizId: mongoose.Types.ObjectId(quizId),
            question: item.question,
            choices: item.choices,
            singleChoice: item.singleChoice,
            randomizeChoices: item.randomizeChoices,
            counter: 0
        }).then((doc: QuizItemMongooseDoc) => this.getItem(doc._id));
    }

    updateItem(itemId: string, item: QuizItemAdmin): Promise<QuizItemAdmin> {
        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(itemId)
            },
            {
                $set: {
                    question: item.question,
                    choices: item.choices
                        .map((ch: QuizItemChoice) => ({ ...ch, _id: mongoose.Types.ObjectId(ch.id) })),
                    singleChoice: item.singleChoice,
                    randomizeChoices: item.randomizeChoices
                }
            },
            {
                new: true
            }
        ).exec().then((doc: QuizItemMongooseDoc) => this.getItem(doc._id));
    }

    deleteItem(itemId: string): Promise<void> {
        return QuizItemModel.findOneAndRemove(
            {
                _id: mongoose.Types.ObjectId(itemId)
            }
        ).exec().then((res: QuizItemMongooseDoc) => {
            if (!res) {
                throw new ApiError('No such item', 404);
            }
        });
    }

    updateQuizItemsOrder(quizId: string, itemIdUp: string, itemIdDown: string): Promise<void> {
        // TODO ### is it possible to perform in single query?
        return Promise.all([itemIdUp, itemIdDown].map((itemId, idx) => {
            return QuizItemModel.update(
                {
                    _id: mongoose.Types.ObjectId(itemId),
                    quizId: mongoose.Types.ObjectId(quizId)
                },
                {
                    $inc: {
                        order: idx === 0 ? -1 : 1
                    }
                }
            ).exec();
        })).then((res: UpdateResult[]) => {
            if (!res.every((r: UpdateResult) => !!r.ok)) {
                throw new ApiError('Order update error', 501);
            }
        });
    }
}
