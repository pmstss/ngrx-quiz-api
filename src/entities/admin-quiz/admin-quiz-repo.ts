import * as mongoose from 'mongoose';
import { QuizMetaAdmin, QuizMetaBasic } from 'ngrx-quiz-common';
import { QuizModel, QuizDoc, QuizMongooseDoc } from '../quiz/quiz-model';
import { QuizItemModel } from '../quiz-item/quiz-item-model';
import { ApiError } from '../../api/api-error';
import { DeleteResult } from '../mongo-types';

export class AdminQuizRepo {
    getQuiz(quizId: string): Promise<QuizMetaAdmin> {
        return QuizModel
            .aggregate()
            .match({
                _id: mongoose.Types.ObjectId(quizId)
            })
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
            .sort({ 'items.order': 1 })
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

    createQuiz(quiz: QuizMetaBasic): Promise<QuizMetaAdmin> {
        return QuizModel.create((<QuizDoc>{
            shortName: quiz.shortName,
            name: quiz.name,
            description: quiz.name,
            descriptionFull: quiz.name,
            randomizeItems: quiz.randomizeItems,
            public: true,
            published: false,
            userId: quiz.userId
        })).then((doc: QuizMongooseDoc) => this.getQuiz(doc._id));
    }

    // TODO ### mark as deleted (with unique shortName change)
    deleteQuiz(quizId: string): Promise<void> {
        return Promise.all([
            <Promise<DeleteResult>><any>
            QuizItemModel.deleteMany({ quizId: mongoose.Types.ObjectId(quizId) }).exec(),
            <Promise<DeleteResult>><any>
            QuizModel.deleteOne({ _id: mongoose.Types.ObjectId(quizId) }).exec()
        ]).then(([itemsDeleteResult, quizDeleteResult]: [DeleteResult, DeleteResult]) => {
            if (!itemsDeleteResult.ok || !quizDeleteResult.ok || quizDeleteResult.n === 0) {
                throw new ApiError('Error deleting quiz', 404);
            }
        });
    }

    updateQuiz(quizId: string, quiz: QuizMetaBasic): Promise<QuizMetaAdmin> {
        return QuizModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(quizId)
            },
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
        .then(() => this.getQuiz(quizId));
    }
}
