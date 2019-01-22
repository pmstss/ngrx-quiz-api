import { Request } from 'express';
import { QuizState, ClientQuizState } from './quiz-state';
import { SessionState } from './session-state';
import { QuizItemAnswerResult } from '../models/quiz-item-answer';

export class StateService {
    private state: SessionState;

    constructor(req: Request) {
        this.state = req.session as any as SessionState;

        if (!this.state.quizes) {
            this.state.quizes = {};
        }
    }

    getQuizState(quizId: string): QuizState {
        return this.state.quizes[quizId];
    }

    hasQuizState(quizId: string): boolean {
        return this.state.quizes.hasOwnProperty(quizId);
    }

    initQuizState(quizId: string, totalQuestions: number, force: boolean = false) {
        if (force || !this.hasQuizState(quizId)) {
            this.state.quizes[quizId] = {
                totalQuestions,
                answers: {},
                score: 0,
                scoreSaved: false
            };
        }
    }

    getClientQuizState(quizId: string): ClientQuizState {
        const quizState = this.getQuizState(quizId);
        return {
            answers: quizState.answers,
            score: quizState.score
        };
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
        quizState.answers[itemId] = answerResult;
        if (answerResult.correct) {
            quizState.score++;
        }
    }

    isFinished(quizId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return quizState && Object.keys(quizState.answers).length === quizState.totalQuestions;
    }

    getQuizScore(quizId: string): number {
        const quizState = this.getQuizState(quizId);
        return quizState ? quizState.score : 0;
    }

    isScoreSaved(quizId: string): boolean {
        const quizState = this.getQuizState(quizId);
        return !quizState || quizState.scoreSaved;
    }
}
