import * as mongoose from 'mongoose';
import { QuizModel, Quiz } from '../models/quiz';
import { QuizItemModel, QuizItem } from '../models/quiz-item';
import { ApiError } from '../api/api-error';

export class QuizRepo {
    getQuizList(): Promise<Quiz[]> {
        return QuizModel
            .aggregate()
            .lookup({
                from: 'items',
                localField: '_id',
                foreignField: 'quizId',
                as: 'items'
            })
            .addFields({
                id: '$_id',
                // TODO ### include in types
                totalQuestions: { $size: '$items' }
            })
            .project({
                _id: 0,
                __v: 0,
                items: 0
            })
            .exec();
    }

    getQuiz(shortName: string): Promise<Quiz> {
        return QuizModel
            .aggregate()
            .match({
                shortName
            })
            .lookup({
                from: 'items',
                localField: '_id',
                foreignField: 'quizId',
                as: 'items'
            })
            .addFields({
                itemIds: {
                    $map: {
                        input: '$items',
                        as: 'x',
                        in: '$$x._id'
                    }
                },
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0,
                items: 0
            })
            .exec()
            .then((docs: mongoose.Document[]) => {
                if (docs.length) {
                    return docs[0];
                }
                throw new ApiError('No such quiz', 404);
            });
    }

    aggregateItems(matchQuery: any): mongoose.Aggregate<any> {
        return QuizItemModel
            .aggregate()
            .match(matchQuery)
            .addFields({
                id: '$_id',
                choices: {
                    $map: {
                        input: '$choices',
                        as: 'x',
                        in: {
                            id: '$$x._id',
                            text: '$$x.text'
                        }
                    }
                }
            })
            .lookup({
                from: 'itemcomments',
                let: { id: '$_id' },
                pipeline: [{
                    $match: {
                        $expr: {
                            $eq: ['$itemId', '$$id']
                        }
                    }
                }],
                as: 'comments'
            })
            .addFields({
                numberOfComments: {
                    $size: '$comments'
                }
            })
            .project({
                _id: 0,
                __v: 0,
                comments: 0
            });
    }

    getItem(itemId: string): Promise<QuizItem> {
        return this.aggregateItems({
            _id: mongoose.Types.ObjectId(itemId)
        }).exec().then((docs: QuizItem[]) => {
            if (docs.length) {
                return docs[0];
            }
            throw new ApiError('No such item', 404);
        });
    }

    getItems(quizId: string): Promise<QuizItem> {
        return this.aggregateItems({
            quizId: mongoose.Types.ObjectId(quizId)
        }).exec();
    }

    submitAnswer(quizId: string, itemId: string, choiceIds: string[]): Promise<any> {
        const choiceObjectIds = choiceIds.map((id: string) => mongoose.Types.ObjectId(id));
        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(itemId),
                quizId: mongoose.Types.ObjectId(quizId)
            },
            {
                $inc: {
                    'choices.$[element].counter': 1,
                    counter: 1
                }
            },
            <mongoose.ModelFindOneAndUpdateOptions><any>{
                arrayFilters: [{
                    'element._id': {
                        $in: choiceObjectIds
                    }
                }],
                multi: true,
                new: true
            }
        ).exec()
        .then((doc: mongoose.Document) => {
            (doc as any).choices.forEach((ch: any) => {
                ch.id = ch._id;
                delete ch._id;
            });
            return doc;
        });
    }
}
