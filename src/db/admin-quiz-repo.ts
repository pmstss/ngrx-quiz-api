import * as mongoose from 'mongoose';
import { QuizModel, Quiz, QuizAdminResponse, QuizDoc } from '../models/quiz';
import { QuizItemModel } from '../models/quiz-item';
import { ApiError } from '../api/api-error';

export class AdminQuizRepo {
    getQuiz(quizId: string): Promise<QuizAdminResponse> {
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
                id: '$_id',
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
                    $mergeObjects: '$$CURRENT',
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
            .then((docs: mongoose.Document[]) => {
                if (docs.length) {
                    return docs[0];
                }
                throw new ApiError('No such quiz', 404);
            });
    }

    createQuiz(quiz: Quiz): Promise<QuizAdminResponse> {
        return QuizModel.create({
            shortName: quiz.shortName,
            name: quiz.name,
            description: quiz.name,
            descriptionFull: quiz.name,
            randomizeItems: quiz.randomizeItems
        }).then(doc => this.getQuiz(doc._id));
    }

    // TODO ### mark as deleted (with unique shortName change)
    // TODO ### define response type
    deleteQuiz(quizId: string) {
        return Promise.all([
            QuizItemModel.deleteMany({ quizId: mongoose.Types.ObjectId(quizId) }).exec(),
            QuizModel.deleteOne({ _id: mongoose.Types.ObjectId(quizId) }).exec()
        ]).then(([itemsDeleteResult, quizDeleteResult]) =>
            ({ itemsDeleteResult, quizDeleteResult }));
    }

    updateQuiz(quizId: string, quiz: Quiz): Promise<QuizAdminResponse> {
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
