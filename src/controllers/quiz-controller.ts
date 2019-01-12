import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { QuizModel, Quiz } from '../models/quiz';
import { NextFunction } from 'connect';
import { QuizItemModel, QuizItem } from '../models/quiz-item';
import { QuizItemChoice } from '../models/quiz-item-choice';

const execSingleCallback = (res: Response, next: NextFunction, transform?: ((doc: any) => any)) => (
    (err: any, docs: any) => {
        if (err) {
            return next(err);
        }

        const doc = docs && docs[0];
        res.json({
            success: !!doc,
            data: doc ? (transform ? transform(doc) : doc) : null
        });
    }
);

const execCallback = (res: Response, next: NextFunction) => ((err: any, docs: any) => {
    if (err) {
        return next(err);
    }
    res.json({
        success: true,
        data: docs
    });
});

export class QuizController {
    getQuizList(req: Request, res: Response, next: NextFunction) {
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
            .exec(execCallback(res, next));
    }

    getQuiz(req: Request, res: Response, next: NextFunction) {
        return QuizModel
            .aggregate()
            .match({
                shortName: req.params.shortName
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
            .exec(execSingleCallback(res, next));
    }

    getItem(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel
            .aggregate()
            .match({
                _id: mongoose.Types.ObjectId(req.params.itemId)
            })
            .addFields({
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0,
                counter: 0,
                'choices.correct': 0,
                'choices.explanation': 0,
                'choices.counter': 0
            })
            // TODO ### is it possible to map _id => id for subdocs too to avoid postprocessing?
            .exec(execSingleCallback(res, next, quizItem => ({
                ...quizItem,
                choices: quizItem.choices.map((ch: any) => ({ text: ch.text, id: ch._id }))
            })));
    }

    createItem(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel.create(<QuizItem>{
            quizId: mongoose.Types.ObjectId(req.params.quizId),
            question: req.body.question || 'My Question',
            choices: req.body.choices ||
                [{ text: 'asdasdasd', correct: false, explanation: 'Dummy', counter: 42 }],
            randomizeChoices: !!req.body.randomizeChoices,
            singleChoice: !!req.body.singleChoice
        }).then(doc => res.json(doc), err => next(err));
    }

    createChoice(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(req.params.itemId)
            },
            {
                $push: {
                    choices: <QuizItemChoice>{
                        text: req.body.text || 'Choice X',
                        explanation: req.body.explanation || 'Explain',
                        correct: !!req.body.correct,
                        counter: 0
                    }
                }
            },
            {
                new: true
            }
        ).exec(execCallback(res, next));
    }

    submitAnswer(req: Request, res: Response, next: NextFunction) {
        const userChoiceIds = req.body.choiceIds ||
            ['5c337b84f246001bd80175b3', '5c337c08c380cd3164e64591', '5c337d5adc664932e81cee3e'];
        if (!userChoiceIds) {
            return res.status(422).send({ status: false });
        }
        const choiceIds = userChoiceIds.map((id: string) => mongoose.Types.ObjectId(id));

        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(req.params.itemId),
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
                        $in: choiceIds
                    }
                }],
                multi: true,
                new: true
            }
        ).exec(this.submitAnswerCallback(userChoiceIds, res, next));
    }

    submitAnswerCallback(userChoiceIds: string[], res: Response, next: NextFunction) {
        return ((err: any, doc: mongoose.Document) => {
            if (err) {
                return next(err);
            }

            if (!doc) {
                return res.status(404).json({ success: false, message: 'Item not found' });
            }

            const choices: (QuizItemChoice & {_id: string})[] = (<any>doc).choices;
            const totalAnswers = choices.reduce((sum, choice) => sum + choice.counter, 0);
            const correctAnswer = choices.filter(ch => ch.correct).map(ch => ch._id)
                .sort().join(' ') === userChoiceIds.sort().join(' ');

            const choicesResult = (<any>doc).choices
                .map((choice: QuizItemChoice & { _id: string }) => ({
                    id: choice._id,
                    explanation: choice.explanation,
                    correct: choice.correct,
                    popularity: choice.counter / totalAnswers
                }));
            // TODO ### store answer in token

            res.json({
                success: true,
                data: {
                    choices: choicesResult,
                    correct: correctAnswer
                }
            });
        });
    }
}
