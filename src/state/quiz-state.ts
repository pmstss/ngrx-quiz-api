import { QuizItemAnswerResult } from '../models/quiz-item-answer';

export interface ClientQuizState {
    answers: { [itemId: string]: QuizItemAnswerResult };
}

export interface QuizState extends ClientQuizState {
    totalQuestions: number;
    score: number;
    scoreSaved: boolean;
    startDate: Date;
}
