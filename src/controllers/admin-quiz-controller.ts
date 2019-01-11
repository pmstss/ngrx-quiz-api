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

export class AdminQuizController {
    getQuiz(req: Request, res: Response, next: NextFunction) {
        return QuizModel
            .aggregate()
            .match({
                _id: mongoose.Types.ObjectId(req.params.quizId)
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
                            question: '$$x.question'
                        }
                    }
                },
                id: '$_id',
            })
            .project({
                _id: 0
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
                _id: 0
            })
            .exec(execSingleCallback(res, next));
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

    updateItem(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(req.params.itemId)
            },
            {
                $set: req.body
            },
            {
                new: true
            }
        ).exec(execSingleCallback(res, next));
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
}
