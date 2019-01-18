import { Response } from 'express';
import { NextFunction } from 'connect';
import { QuizItemChoice } from '../models/quiz-item-choice';
import { QuizRepo } from '../db/quiz-repo';
import { ApiRequest } from '../api/api-request';
import { QuizItemAnswerResult } from '../models/quiz-item-answer';
import { QuizItem } from '../models/quiz-item';
import { writeResponse } from '../api/response-writer';

function arrayEqual(array1: any[], array2: any[]) {
    return [...array1].sort().join(' ') === [...array2].sort().join(' ');
}

export class QuizController {
    constructor(private repo: QuizRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getQuizList(), req, res, next);
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getQuiz(req.params.shortName), req, res, next);
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getItem(req.params.itemId), req, res, next);
    }

    submitAnswer(req: ApiRequest, res: Response, next: NextFunction) {
        const userChoiceIds = req.body.choiceIds;
        if (!userChoiceIds) {
            return res.status(422).send({ status: false });
        }

        writeResponse(
            this.repo.submitAnswer(req.params.itemId, userChoiceIds)
                .then((doc: QuizItem) => {
                    const answerResult = this.prepareAnswerResult(userChoiceIds, doc);

                    // TODO ### sessionService
                    // req.tokenService.addAnswer(req.params.itemId, answerResult);
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
