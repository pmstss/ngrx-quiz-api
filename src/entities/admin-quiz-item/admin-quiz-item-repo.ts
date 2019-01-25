import * as mongoose from 'mongoose';
import { QuizItemModel, QuizItem, QuizItemUpdate } from '../quiz-item/quiz-item-model';

export class AdminQuizItemRepo {
    getItem(itemId: string): Promise<QuizItem> {
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
            .then((res: QuizItem[]) => res[0]);
    }

    createItem(quizId: string, item: QuizItem) {
        return QuizItemModel.create(<QuizItem>{
            quizId: mongoose.Types.ObjectId(quizId),
            question: item.question,
            choices: item.choices,
            singleChoice: item.singleChoice,
            randomizeChoices: item.randomizeChoices,
            counter: 0,
            order: 0
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
                    choices: item.choices
                        .map(ch => ({ ...ch, _id: mongoose.Types.ObjectId(ch.id) })),
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

    // TODO ### define response type
    updateQuizItemsOrder(quizId: string, itemIds: string[]) {
        // TODO ### is it possible to perform in single query?
        return Promise.all(itemIds.map((itemId, idx) => {
            return QuizItemModel.update(
                {
                    _id: mongoose.Types.ObjectId(itemId),
                    quizId: mongoose.Types.ObjectId(quizId),
                },
                {
                    $set: {
                        order: idx
                    }
                }
            ).exec();
        }));
    }
}
