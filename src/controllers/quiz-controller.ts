import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { QuizItemChoice } from '../models/quiz-item-choice';
import { QuizRepo } from './quiz-repo';
import { handleRepoResult } from './utils';

function arrayEqual(array1: any[], array2: any[]) {
    return [...array1].sort().join(' ') === [...array2].sort().join(' ');
}

export class QuizController {
    constructor(private repo: QuizRepo) {
    }

    getQuizList(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.getQuizList(), res, next);
    }

    getQuiz(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.getQuiz(req.params.shortName), res, next);
    }

    getItem(req: Request, res: Response, next: NextFunction) {
        handleRepoResult(this.repo.getItem(req.params.itemId), res, next);
    }

    submitAnswer(req: Request, res: Response, next: NextFunction) {
        const userChoiceIds = req.body.choiceIds;
        if (!userChoiceIds) {
            return res.status(422).send({ status: false });
        }
        const choiceObjectIds = userChoiceIds.map((id: string) => mongoose.Types.ObjectId(id));

        handleRepoResult(
            this.repo.submitAnswer(req.params.itemId, choiceObjectIds)
                .then(doc => this.prepareAnswerMeta(userChoiceIds, doc)),
            res,
            next
        );
    }

    prepareAnswerMeta(userChoiceIds: string[], doc: mongoose.Document) {
        if (!doc) {
            throw new Error('Item not found');
        }

        const choices: (QuizItemChoice & {_id: string})[] = (<any>doc).choices;
        const totalAnswers = choices.reduce((sum, ch) => sum + ch.counter, 0);

        // TODO ### store answer in token
        return {
            choices: choices.map((choice: QuizItemChoice & { _id: string }) => ({
                id: choice._id,
                explanation: choice.explanation,
                correct: choice.correct,
                popularity: choice.counter / totalAnswers
            })),
            correct: arrayEqual(
                userChoiceIds,
                choices.filter(ch => ch.correct).map(ch => ch._id)
            )
        };
    }
}
