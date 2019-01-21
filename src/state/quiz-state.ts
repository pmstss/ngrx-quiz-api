import { QuizItemAnswerResult } from '../models/quiz-item-answer';

export interface ClientQuizState {
    score: number;
    answers: { [itemId: string]: QuizItemAnswerResult };
}

export interface QuizState extends ClientQuizState {
    totalQuestions: number;
    answered: number;
}
