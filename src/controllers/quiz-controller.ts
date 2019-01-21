import { Response } from 'express';
import { NextFunction } from 'connect';
import { QuizItemChoice } from '../models/quiz-item-choice';
import { QuizRepo } from '../db/quiz-repo';
import { ApiRequest } from '../api/api-request';
import { QuizItemAnswerResult, QuizChoiceAnswerResult } from '../models/quiz-item-answer';
import { QuizItem } from '../models/quiz-item';
import { QuizState, QuizStateExternal } from '../models/quiz-state';
import { writeResponse, writeErrorResponse } from '../api/response-writer';
import { ApiError } from '../api/api-error';
import { Quiz } from '../models/quiz';

function arrayEqual(array1: any[], array2: any[]) {
    return [...array1].sort().join(' ') === [...array2].sort().join(' ');
}

function initQuizState(totalQuestions: number): QuizState {
    return {
        totalQuestions,
        answered: 0,
        score: 0,
        answers: {}
    };
}

export class QuizController {
    constructor(private repo: QuizRepo) {
    }

    getQuizList(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(this.repo.getQuizList(), req, res, next);
    }

    getQuiz(req: ApiRequest, res: Response, next: NextFunction) {
        if (!req.session.quizes) {
            req.session.quizes = {};
        }

        writeResponse(
            this.repo.getQuiz(req.params.shortName)
                .then((quiz: Quiz): {quizMeta: Quiz, quizState: QuizStateExternal } => {
                    if (!req.session.quizes[quiz.id]) {
                        req.session.quizes[quiz.id] = initQuizState(quiz.totalQuestions);
                    }
                    return {
                        quizMeta: quiz,
                        quizState: {
                            answers: req.session.quizes[quiz.id].answers,
                            score: req.session.quizes[quiz.id].score
                        }
                    };
                }),
            req, res, next
        );
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction) {
        writeResponse(
            this.repo.getItem(req.params.itemId)
                .then((item: QuizItem) => {
                    const quizState: QuizState = req.session.quizes[item.quizId as string];
                    if (!quizState) {
                        throw new ApiError('Quiz is not initialized', 409);
                    }

                    const answers = quizState.answers[req.params.itemId];
                    const choices = answers && answers.choices;
                    return {
                        ...item,
                        choices: item.choices.map((itemChoice) => {
                            const choice: QuizChoiceAnswerResult =
                                choices && choices.find(ch => ch.id === itemChoice.id);
                            return {
                                ...itemChoice,
                                checked: choice && choice.checked
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

        const quizState: QuizState = req.session.quizes[quizId];
        if (!quizState) {
            writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        } else if (quizState.answers[itemId]) {
            writeErrorResponse(res, next, new ApiError('Answer is already submitted', 409));
        } else {
            writeResponse(
                this.repo.submitAnswer(quizId, itemId, userChoiceIds)
                    .then((doc: QuizItem) => {
                        const answerResult = this.prepareAnswerResult(userChoiceIds, doc);

                        quizState.answers[itemId] = answerResult;
                        quizState.answered++;
                        if (answerResult.correct) {
                            quizState.score++;
                        }

                        return answerResult;
                    }),
                req, res, next);
        }
    }

    prepareAnswerResult(userChoiceIds: string[], doc: QuizItem): QuizItemAnswerResult {
        if (!doc) {
            throw new ApiError('Item not found', 404);
        }

        const choices: QuizItemChoice[] = doc.choices;
        const totalAnswers = choices.reduce((sum, ch) => sum + ch.counter, 0);

        return {
            choices: choices.map((choice: QuizItemChoice) => {
                const checked = userChoiceIds.includes(choice.id);
                return {
                    checked,
                    id: choice.id,
                    explanation: checked && choice.explanation,
                    correct: choice.correct,
                    popularity: choice.counter / totalAnswers
                };
            }),
            correct: arrayEqual(
                userChoiceIds,
                choices.filter(ch => ch.correct).map(ch => ch.id)
            )
        };
    }
}
