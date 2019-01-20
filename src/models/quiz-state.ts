import { QuizItemAnswerResult } from './quiz-item-answer';

export interface QuizStateExternal {
    score: number;
    answers: { [itemId: string]: QuizItemAnswerResult };
}

export interface QuizState extends QuizStateExternal {
    totalQuestions: number;
    answered: number;
}
