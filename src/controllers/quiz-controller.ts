import { Response } from 'express';
import { NextFunction } from 'connect';
import { QuizRepo } from '../db/quiz-repo';
import { ApiRequest } from '../api/api-request';
import { QuizChoiceAnswerResult } from '../models/quiz-item-answer';
import { QuizItem } from '../models/quiz-item';
import { QuizState, ClientQuizState } from '../state/quiz-state';
import { writeResponse, writeErrorResponse } from '../api/response-writer';
import { ApiError } from '../api/api-error';
import { Quiz } from '../models/quiz';
import { AnswerResultHelper } from './helpers/answer-result-helper';

export class QuizController {
    constructor(private repo: QuizRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getQuizList(), req, res, next);
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.getQuiz(req.params.shortName)
                .then((quiz: Quiz): {quizMeta: Quiz, quizState: ClientQuizState } => {
                    req.stateService.initQuizState(quiz.id, quiz.totalQuestions, false);
                    return {
                        quizMeta: quiz,
                        quizState: req.stateService.getClientQuizState(quiz.id)
                    };
                }),
            req, res, next
        );
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.getItem(req.params.itemId)
                .then((item: QuizItem) => {
                    if (!req.stateService.hasQuizState(item.quizId as string)) {
                        throw new ApiError('Quiz is not initialized', 409);
                    }

                    const answers = req.stateService
                        .getAnswers(item.quizId as string, req.params.itemId);
                    const choices: QuizChoiceAnswerResult[] = answers ? answers.choices : null;
                    return {
                        ...item,
                        choices: item.choices.map((itemChoice) => {
                            const choice: QuizChoiceAnswerResult =
                                choices && choices.find(ch => ch.id === itemChoice.id);
                            return {
                                ...itemChoice,
                                checked: choice && choice.checked || false
                            };
                        })
                    };
                }),
            req, res, next
        );
    }

    submitAnswer(req: ApiRequest, res: Response, next: NextFunction) {
        const quizId = req.body.quizId;
        const itemId = req.params.itemId;
        const userChoiceIds = req.body.choiceIds;
        if (!userChoiceIds || !quizId || !itemId) {
            writeErrorResponse(res, next, new ApiError('Missing required parameters', 422));
            return;
        }

        if (!req.stateService.hasQuizState(quizId)) {
            writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        } else if (req.stateService.isAnswered(quizId, itemId)) {
            writeErrorResponse(res, next, new ApiError('Answer is already submitted', 409));
        } else {
            writeResponse(
                this.repo.submitAnswer(quizId, itemId, userChoiceIds)
                    .then((doc: QuizItem) => {
                        const answerResult = AnswerResultHelper.create(userChoiceIds, doc);
                        req.stateService.addAnswer(quizId, itemId, answerResult);

                        if (req.stateService.isScoreSaveRequired(quizId)) {
                            this.repo.saveScore(req.stateService.getQuizScoreModel(quizId));
                        }

                        return answerResult;
                    }),
                req, res, next);
        }
    }

    resetQuizState(req: ApiRequest, res: Response, next: NextFunction) {
        const quizState: QuizState = req.stateService.getQuizState(req.params.quizId);
        if (!quizState) {
            writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        } else {
            req.stateService.initQuizState(req.params.quizId, quizState.totalQuestions, true);
            writeResponse(Promise.resolve(null), req, res, next);
        }
    }

    getQuizScores(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getTopScores(req.params.quizId), req, res, next);
    }
}
