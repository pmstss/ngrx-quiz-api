import * as mongoose from 'mongoose';
import { QuizModel } from '../models/quiz';
import { QuizItemModel } from '../models/quiz-item';

export class QuizRepo {
    getQuizList(): Promise<any> {
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
                totalQuestions: { $size: '$items' }
            })
            .project({
                _id: 0,
                __v: 0,
                items: 0
            })
            .exec();
    }

    getQuiz(shortName: string): Promise<any> {
        return QuizModel
            .aggregate()
            .match({
                shortName
                // { _id: mongoose.Types.ObjectId(req.params.shortName) }
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
            .addFields({
                items: {
                    $map: {
                        input: '$items',
                        as: 'x',
                        in: {
                            id: '$$x._id'
                        }
                    }
                },
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((docs: mongoose.Document[]) => docs[0]);
    }

    getItem(itemId: string): Promise<any> {
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
                            id: '$$x._id',
                            text: '$$x.text'
                        }
                    }
                }
            })
            .project({
                _id: 0,
                __v: 0,
                counter: 0
            })
            .exec()
            .then((docs: mongoose.Document[]) => docs[0]);
    }

    submitAnswer(itemId: string, choiceIds: string[]): Promise<any> {
        const choiceObjectIds = choiceIds.map((id: string) => mongoose.Types.ObjectId(id));
        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(itemId),
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
