import * as mongoose from 'mongoose';
import { QuizItemModel, QuizItem, QuizItemMongooseDoc } from './quiz-item-model';
import { ApiError } from '../../api/api-error';
import { QuizItemChoice, QuizItemChoiceMongooseDoc } from './quiz-item-choice-model';

export class QuizItemRepo {
    private aggregateItems(matchQuery: any): mongoose.Aggregate<QuizItem[]> {
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
        }).exec().then((res: QuizItem[]) => {
            if (res.length) {
                return res[0];
            }
            throw new ApiError('No such item', 404);
        });
    }

    getItems(quizId: string): Promise<QuizItem[]> {
        return this.aggregateItems({
            quizId: mongoose.Types.ObjectId(quizId)
        }).exec();
    }

    submitAnswer(quizId: string, itemId: string, choiceIds: string[]): Promise<QuizItem> {
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
        .then((doc: QuizItemMongooseDoc): QuizItem => ({
            ...doc.toObject(),
            choices: doc.choices.map((ch: QuizItemChoiceMongooseDoc): QuizItemChoice => ({
                id: ch._id,
                counter: ch.counter,
                text: ch.text,
                explanation: ch.explanation,
                correct: ch.correct
            }))
        }));
    }
}
