import { Response, NextFunction } from 'express';
import { QuizItem, QuizItemAnswered, QuizItemChoiceAnswer, QuizItemChoice,
    QuizItemAnswer,
    QuizItemAdmin} from 'ngrx-quiz-common';
import { QuizItemRepo } from './quiz-item-repo';
import { ScoreRepo } from '../score/score-repo';
import { ApiRequest } from '../../api/api-request';
import { ApiError } from '../../api/api-error';
import { writeResponse, writeErrorResponse } from '../../api/response-writer';
import { AnswerResultHelper } from './answer-result-helper';

export class QuizItemController {
    constructor(private repo: QuizItemRepo, private scoreRepo: ScoreRepo) {
    }

    getQuizItems(req: ApiRequest, res: Response, next: NextFunction): Promise<QuizItem[]> {
        const quizId = req.query.quizId;
        if (!req.stateService.hasQuizState(quizId)) {
            throw new ApiError('Quiz is not initialized', 409);
        }

        if (!req.stateService.isFinished(quizId)) {
            throw new ApiError('Quiz is not finished', 409);
        }

        return writeResponse(this.repo.getItems(quizId), req, res, next);
    }

    getItem(req: ApiRequest, res: Response, next: NextFunction):
            Promise<QuizItem | QuizItemAnswered> {
        return writeResponse(
            this.repo.getItem(req.params.itemId)
                .then((item: QuizItem) => {
                    if (!req.stateService.hasQuizState(item.quizId)) {
                        throw new ApiError('Quiz is not initialized', 409);
                    }

                    const itemAnswer: QuizItemAnswer = req.stateService
                        .getItemAnswer(item.quizId, req.params.itemId);
                    if (!itemAnswer) {
                        return item;
                    }

                    const choices: QuizItemChoiceAnswer[] = itemAnswer.choices || [];
                    return {
                        ...item,
                        choices: item.choices.map((itemChoice: QuizItemChoice) => {
                            const choice: QuizItemChoiceAnswer =
                                choices && choices.find(ch => ch.id === itemChoice.id);
                            return {
                                ...itemChoice,
                                ...choice
                            };
                        })
                    };
                }),
            req, res, next
        );
    }

    submitAnswer(req: ApiRequest, res: Response, next: NextFunction):
            Promise<QuizItemAnswer> {
        const quizId = req.body.quizId;
        const itemId = req.params.itemId;
        const userChoiceIds = req.body.choiceIds;
        if (!userChoiceIds || !quizId || !itemId) {
            return writeErrorResponse(res, next, new ApiError('Missing required parameters', 422));
        }

        if (!req.stateService.hasQuizState(quizId)) {
            return writeErrorResponse(res, next, new ApiError('Quiz is not initialized', 409));
        }

        if (req.stateService.isAnswered(quizId, itemId)) {
            return writeErrorResponse(res, next, new ApiError('Answer is already submitted', 409));
        }

        return writeResponse(
            this.repo.submitAnswer(quizId, itemId, userChoiceIds)
                .then((doc: QuizItemAdmin) => {
                    const answerResult = AnswerResultHelper.create(userChoiceIds, doc);
                    req.stateService.addAnswer(quizId, itemId, answerResult);

                    if (req.stateService.isScoreSaveRequired(quizId)) {
                        this.scoreRepo.saveScore(req.stateService.getQuizScoreDoc(quizId));
                    }

                    return answerResult;
                }),
            req, res, next);
    }
}
