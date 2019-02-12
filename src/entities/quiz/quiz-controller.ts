/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Response, NextFunction } from 'express';
import { QuizMeta, QuizMetaListItem, QuizMetaBasic } from 'ngrx-quiz-common';
import { ApiRequest } from '../../api/api-request';
import { ApiError } from '../../api/api-error';
import { writeResponse, writeErrorResponse } from '../../api/response-writer';
import { QuizState, ClientQuizState } from '../../state/quiz-state';
import { QuizRepo } from './quiz-repo';

export class QuizController {
    constructor(private repo: QuizRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMetaListItem[]> {
        return writeResponse(
            this.repo.getQuizList().then(
                (quizes: (QuizMetaBasic & {totalQuestions: number})[]): QuizMetaListItem[] =>
                quizes.map((quiz: (QuizMetaBasic & {totalQuestions: number})): QuizMetaListItem => ({
                    ...quiz,
                    started: req.stateService.isStarted(quiz.id),
                    finished: req.stateService.isFinished(quiz.id)
                }))
            ),
            req, res, next
        );
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizMeta & ClientQuizState> {
        return writeResponse(
            this.repo.getQuiz(req.params.shortName)
                .then((quiz: QuizMeta): QuizMeta & ClientQuizState => {
                    req.stateService.initQuizState(quiz);
                    return {
                        ...quiz,
                        ...req.stateService.getClientQuizState(quiz.id)
                    };
                }),
            req, res, next
        );
    }

    resetQuizState(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
        const quizState: QuizState = req.stateService.getQuizState(req.params.quizId);
        if (!quizState) {
            return writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        }

        req.stateService.resetQuizState(req.params.quizId);
        return writeResponse(Promise.resolve(), req, res, next);
    }
}
