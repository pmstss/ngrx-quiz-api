import * as mongoose from 'mongoose';
import { QuizModel, Quiz } from '../models/quiz';
import { QuizItemModel, QuizItem, QuizItemUpdate } from '../models/quiz-item';
import { QuizItemChoice } from '../models/quiz-item-choice';

export class AdminQuizRepo {
    getQuiz(quizId: string): Promise<mongoose.Document> {
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
            .addFields({
                items: {
                    $map: {
                        input: '$items',
                        as: 'x',
                        in: {
                            id: '$$x._id',
                            choices: '$$x.choices',
                            question: '$$x.question',
                            singleChoice: '$$x.singleChoice'
                        }
                    }
                },
                id: '$_id',
            })
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((docs: mongoose.Document[]) => docs[0]);
    }

    createQuiz(quiz: Quiz) {
        return QuizModel.create(<Quiz>{
            shortName: quiz.shortName,
            name: quiz.name,
            description: quiz.name,
            descriptionFull: quiz.name,
            timeLimit: quiz.timeLimit,
            randomizeItems: quiz.randomizeItems,
            items: []
        }).then(doc => this.getQuiz(doc.get('_id')));
    }

    deleteQuiz(quizId: string) {
        return Promise.all([
            QuizItemModel.deleteMany({ quizId: mongoose.Types.ObjectId(quizId) }).exec(),
            QuizModel.deleteOne({ _id: mongoose.Types.ObjectId(quizId) }).exec()
        ]).then(([itemsDeleteResult, quizDeleteResult]) =>
            ({ itemsDeleteResult, quizDeleteResult }));
    }

    updateQuiz(quizId: string, quiz: Quiz) {
        return QuizModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(quizId)
            },
            {
                $set: <Quiz>{
                    shortName: quiz.shortName,
                    name: quiz.name,
                    description: quiz.description,
                    descriptionFull: quiz.descriptionFull,
                    timeLimit: quiz.timeLimit,
                    randomizeItems: quiz.randomizeItems
                }
            },
            {
                // there is return new flag, but no way to adjust fields ($addFields, $project)?
                new: true
            }
        ).exec()
        .then(() => this.getQuiz(quizId));
    }

    getItem(itemId: string) {
        return QuizItemModel
            .aggregate()
            .match({
                _id: mongoose.Types.ObjectId(itemId)
            })
            .addFields({
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((docs: mongoose.Document[]) => docs[0]);
    }

    createItem(quizId: string, item: QuizItem) {
        return QuizItemModel.create(<QuizItem>{
            quizId: mongoose.Types.ObjectId(quizId),
            question: item.question,
            choices: item.choices,
            singleChoice: item.singleChoice,
            randomizeChoices: item.randomizeChoices,
            counter: 0
        }).then(doc => this.getItem(doc.get('_id')));
    }

    updateItem(itemId: string, item: QuizItem) {
        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(itemId)
            },
            {
                $set: <QuizItemUpdate>{
                    question: item.question,
                    choices: item.choices,
                    singleChoice: item.singleChoice,
                    randomizeChoices: item.randomizeChoices
                }
            },
            {
                new: true
            }
        ).exec().then(() => this.getItem(itemId));
    }

    deleteItem(itemId: string) {
        return QuizItemModel.findOneAndRemove(
            {
                _id: mongoose.Types.ObjectId(itemId)
            }
        ).exec();
    }
}
