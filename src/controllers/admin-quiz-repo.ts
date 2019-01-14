import * as mongoose from 'mongoose';
import { QuizModel, Quiz } from '../models/quiz';
import { QuizItemModel, QuizItem, QuizItemUpdate } from '../models/quiz-item';

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
                            singleChoice: '$$x.singleChoice',
                            order: '$$x.order'
                        }
                    }
                },
                id: '$_id',
            })
            /*.unwind('$items')
            .sort({ 'items.order': -1 })
            .group({
                _id: '$_id',
                items: {
                    $push: '$items'
                }
            })*/
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((docs: mongoose.Document[]) => {
                (<any>docs[0]).items.sort((i1: any, i2: any) => i1.order - i2.order);
                return docs[0];
            });
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
            }
        ).exec()
        .then(() => this.getQuiz(quizId));
    }

    updateQuizItemsOrder(quizId: string, itemIds: string[]) {
        // TODO ### is it possible to perform in single query?
        return Promise.all(itemIds.map((itemId, idx) => {
            return QuizItemModel.update(
                {
                    _id: mongoose.Types.ObjectId(itemId),
                },
                {
                    $set: {
                        order: idx
                    }
                }
            ).exec();
        }));
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
