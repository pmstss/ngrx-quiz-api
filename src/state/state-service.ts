import * as mongoose from 'mongoose';
import { QuizMeta, QuizItemAnswer } from 'ngrx-quiz-common';
import { QuizState, ClientQuizState } from './quiz-state';
import { SessionState } from './session-state';
import { QuizScoreDoc } from '../entities/score/score-model';
import { ApiRequest } from '../api/api-request';

export class StateService {
    private state: SessionState;

    constructor(private req: ApiRequest) {
        this.state = req.session as any as SessionState;

        if (!this.state.quizes) {
            this.state.quizes = {};
        }
    }

    getQuizState(quizId: string): QuizState {
        return this.state.quizes[quizId];
    }

    getIdByName(quizName: string): string {
        return Object.keys(this.state.quizes).find(id =>
                this.state.quizes[id].shortName === quizName);
    }

    hasQuizState(quizId: string): boolean {
        return this.state.quizes.hasOwnProperty(quizId);
    }

    initQuizState(quiz: QuizMeta) {
        if (!this.hasQuizState(quiz.id)) {
            this.state.quizes[quiz.id] = {
                itemIds: quiz.itemIds,
                shortName: quiz.shortName,
                answers: {},
                score: 0,
                scoreSaved: false,
                startDate: new Date()
            };
        }
    }

    resetQuizState(quizId: string) {
        if (this.hasQuizState(quizId)) {
            this.state.quizes[quizId] = {
                ...this.state.quizes[quizId],
                answers: {},
                score: 0,
                scoreSaved: false,
                startDate: new Date()
            };
        }
    }

    getClientQuizState(quizId: string): ClientQuizState {
        const quizState = this.getQuizState(quizId);
        return {
            answers: quizState.answers
        };
    }

    getAnsweredCount(quizId: string): number {
        const quizState = this.getQuizState(quizId);
        return quizState ? Object.keys(quizState.answers).length : 0;
    }

    getTotalQuestions(quizId: string): number {
        const quizState = this.getQuizState(quizId);
        return quizState ? quizState.itemIds.length : 0;
    }

    isStarted(quizId: string): boolean {
        return this.getAnsweredCount(quizId) > 0;
    }

    isFinished(quizId: string): boolean {
        const total = this.getTotalQuestions(quizId);
        return total > 0 && this.getAnsweredCount(quizId) === total;
    }

    isAnswered(quizId: string, itemId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return quizState.answers.hasOwnProperty(itemId);
    }

    getItemAnswer(quizId: string, itemId: string): QuizItemAnswer {
        return this.getQuizState(quizId).answers[itemId];
    }

    addAnswer(quizId: string, itemId: string, answerResult: QuizItemAnswer) {
        const quizState = this.getQuizState(quizId);
        if (!this.isStarted(quizId)) {
            quizState.startDate = new Date();
        }

        quizState.answers[itemId] = answerResult;
        if (answerResult.correct) {
            quizState.score++;
        }
    }

    isScoreSaved(quizId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return !quizState || quizState.scoreSaved;
    }

    isScoreSaveRequired(quizId: string): boolean {
        return this.isFinished(quizId) && !this.isScoreSaved(quizId);
    }

    getQuizScoreDoc(quizId: string): QuizScoreDoc {
        const quizState = this.getQuizState(quizId);
        const userId = this.req.tokenData && this.req.tokenData.user && this.req.tokenData.user.id;
        return {
            quizId: new mongoose.Types.ObjectId(quizId),
            userId: userId ? new mongoose.Types.ObjectId(userId) : null,
            sessionId: this.req.sessionID,
            score: quizState.score / quizState.itemIds.length
        };
    }
}
