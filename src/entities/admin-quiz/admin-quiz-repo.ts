/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import * as mongoose from 'mongoose';
import { QuizMetaAdmin, QuizMetaBasic, User, QuizMetaListItem } from 'ngrx-quiz-common';
import { ApiError } from '../../api/api-error';
import { DeleteResult } from '../mongo-types';
import { QuizModel, QuizDoc, QuizMongooseDoc } from '../quiz/quiz-model';
import { QuizItemModel } from '../quiz-item/quiz-item-model';

interface QuizMatchCriteria {
    _id: mongoose.Types.ObjectId;
    userId?: string;
}

export class AdminQuizRepo {
    getQuizList(user: User): Promise<QuizMetaListItem[]> {
        const criteria = this.getQuizMatchCriteria(null, user);
        delete criteria._id;

        return QuizModel
            .aggregate()
            .match(criteria)
            .lookup({
                from: 'items',
                localField: '_id',
                foreignField: 'quizId',
                as: 'items'
            })
            .addFields({
                id: '$_id',
                totalQuestions: { $size: '$items' }
            })
            .project({
                _id: 0,
                __v: 0,
                items: 0
            })
            .exec();
    }

    private getQuizMatchCriteria(quizId: string, user: User): QuizMatchCriteria {
        const criteria: QuizMatchCriteria =             {
            _id: mongoose.Types.ObjectId(quizId)
        };
        if (!user.admin) {
            criteria.userId = user.id;
        }
        return criteria;
    }

    getQuiz(quizId: string, user: User): Promise<QuizMetaAdmin> {
        return QuizModel
            .aggregate()
            .match(this.getQuizMatchCriteria(quizId, user))
            .lookup({
                from: 'items',
                let: { id: '$_id' },
                pipeline: [{
                    $match: {
                        $expr: {
                            $eq: ['$quizId', '$$id']
                        }
                    }
                }],
                as: 'items'
            })
            // adding "id" instead of "_id" for items and their inner choices
            .addFields({
                items: {
                    $map: {
                        input: '$items',
                        as: 'x',
                        in: {
                            $mergeObjects: [
                                '$$x',
                                {
                                    id: '$$x._id',
                                    choices: {
                                        $map: {
                                            input: '$$x.choices',
                                            as: 'y',
                                            in: {
                                                $mergeObjects: [
                                                    '$$y',
                                                    { id: '$$y._id' }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                id: '$_id'
            })
            // sorting by items order
            .unwind({ path: '$items', preserveNullAndEmptyArrays: true })
            .sort({ 'items.order': 1, 'items.updatedAt': 1 })
            .group({
                _id: '$_id',
                items: {
                    $push: '$items'
                },
                quizMeta: {
                    $mergeObjects: '$$CURRENT'
                }
            })
            .project({
                'quizMeta.items': 0
            })
            .replaceRoot({
                $mergeObjects: ['$quizMeta', { items: '$items' }]
            })
            // removing aux fields
            .project({
                _id: 0,
                __v: 0,
                'items._id': 0,
                'items.__v': 0,
                'items.choices._id': 0
            })
            .exec()
            .then((res: QuizMetaAdmin[]) => {
                if (res.length) {
                    return res[0];
                }
                throw new ApiError('No such quiz', 404);
            });
    }

    createQuiz(quiz: QuizMetaBasic, user: User): Promise<QuizMetaAdmin> {
        return QuizModel.create((<QuizDoc>{
            shortName: quiz.shortName,
            name: quiz.name,
            description: quiz.name,
            descriptionFull: quiz.name,
            randomizeItems: quiz.randomizeItems,
            public: true,
            published: false,
            userId: user.id
        })).then((doc: QuizMongooseDoc) => this.getQuiz(doc._id, user));
    }

    deleteQuiz(quizId: string, user: User): Promise<void> {
        return QuizModel.deleteOne(this.getQuizMatchCriteria(quizId, user)).exec()
            .then((quizDeleteResult: DeleteResult) => {
                if (!quizDeleteResult.ok || quizDeleteResult.n === 0) {
                    throw new ApiError('Error deleting quiz', 404);
                }
            })
            .then(() => {
                return QuizItemModel.deleteMany({ quizId: mongoose.Types.ObjectId(quizId) }).exec();
            }).then((itemsDeleteResult: DeleteResult) => {
                if (!itemsDeleteResult.ok) {
                    throw new ApiError('Error deleting quiz', 404);
                }
            });
    }

    updateQuiz(quizId: string, quiz: QuizMetaBasic, user: User): Promise<QuizMetaAdmin> {
        return QuizModel.findOneAndUpdate(
            this.getQuizMatchCriteria(quizId, user),
            {
                $set: <QuizDoc>{
                    shortName: quiz.shortName,
                    name: quiz.name,
                    description: quiz.description,
                    descriptionFull: quiz.descriptionFull,
                    randomizeItems: quiz.randomizeItems
                }
            }
        ).exec()
        .then(() => this.getQuiz(quizId, user));
    }

    publishQuiz(quizId: string, user: User): Promise<boolean> {
        return QuizModel.findOneAndUpdate(
            this.getQuizMatchCriteria(quizId, user),
            {
                $set: <QuizDoc>{
                    published: true
                }
            }
        ).exec()
        .then((doc: QuizMongooseDoc) => !!doc);
    }

    unpublishQuiz(quizId: string, user: User): Promise<boolean> {
        return QuizModel.findOneAndUpdate(
            this.getQuizMatchCriteria(quizId, user),
            {
                $set: <QuizDoc>{
                    published: false
                }
            }
        ).exec()
        .then((doc: QuizMongooseDoc) => !!doc);
    }
}
