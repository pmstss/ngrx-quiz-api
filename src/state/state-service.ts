import { QuizState, ClientQuizState } from './quiz-state';
import { SessionState } from './session-state';
import { QuizItemAnswerResult } from '../models/quiz-item-answer';
import { QuizScore } from '../models/quiz-score';
import { ApiRequest } from '../api/api-request';
import { Quiz } from '../models/quiz';

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

    initQuizState(quiz: Quiz) {
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

    isStarted(quizId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return !!quizState && Object.keys(quizState.answers).length > 0;
    }

    isFinished(quizId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return !!quizState && Object.keys(quizState.answers).length === quizState.itemIds.length;
    }

    isAnswered(quizId: string, itemId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return quizState.answers.hasOwnProperty(itemId);
    }

    getAnswers(quizId: string, itemId: string): QuizItemAnswerResult {
        return this.getQuizState(quizId).answers[itemId];
    }

    addAnswer(quizId: string, itemId: string, answerResult: QuizItemAnswerResult) {
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

    getQuizScoreModel(quizId: string): QuizScore {
        const quizState = this.getQuizState(quizId);
        return {
            quizId,
            sessionId: this.req.sessionID,
            userId: this.req.tokenData && this.req.tokenData.user && this.req.tokenData.user.id,
            score: quizState.score / quizState.itemIds.length,
            startDate: quizState.startDate
        };
    }
}
