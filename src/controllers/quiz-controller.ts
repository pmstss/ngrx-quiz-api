import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { QuizItemChoice } from '../models/quiz-item-choice';
import { QuizRepo } from '../db/quiz-repo';
import { RequestWithToken } from '../token/request-with-token';
import { QuizItemAnswerResult } from '../models/quiz-item-answer';
import { QuizItem } from '../models/quiz-item';
import { writeRepoResponse } from '../api/response-writer';

function arrayEqual(array1: any[], array2: any[]) {
    return [...array1].sort().join(' ') === [...array2].sort().join(' ');
}

export class QuizController {
    constructor(private repo: QuizRepo) {
    }

    getQuizList(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.getQuizList(), req, res, next);
    }

    getQuiz(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.getQuiz(req.params.shortName), req, res, next);
    }

    getItem(req: RequestWithToken, res: Response, next: NextFunction) {
        writeRepoResponse(this.repo.getItem(req.params.itemId), req, res, next);
    }

    submitAnswer(req: RequestWithToken, res: Response, next: NextFunction) {
        const userChoiceIds = req.body.choiceIds;
        if (!userChoiceIds) {
            return res.status(422).send({ status: false });
        }

        writeRepoResponse(
            this.repo.submitAnswer(req.params.itemId, userChoiceIds)
                .then((doc: QuizItem) => {
                    const answerResult = this.prepareAnswerResult(userChoiceIds, doc);
                    req.tokenService.addAnswer(req.params.itemId, answerResult);
                    return answerResult;
                }),
            req, res, next);
    }

    prepareAnswerResult(userChoiceIds: string[], doc: QuizItem): QuizItemAnswerResult {
        if (!doc) {
            throw new Error('Item not found');
        }

        const choices: QuizItemChoice[] = doc.choices;
        const totalAnswers = choices.reduce((sum, ch) => sum + ch.counter, 0);

        return {
            choices: choices.map((choice: QuizItemChoice) => ({
                id: choice.id,
                explanation: choice.explanation,
                correct: choice.correct,
                popularity: choice.counter / totalAnswers
            })),
            correct: arrayEqual(
                userChoiceIds,
                choices.filter(ch => ch.correct).map(ch => ch.id)
            )
        };
    }
}
