import { QuizItemAnswerResult } from '../models/quiz-item-answer';

export interface ClientQuizState {
    answers: { [itemId: string]: QuizItemAnswerResult };
}

export interface QuizState extends ClientQuizState {
    totalQuestions: number;
    shortName: string;
    score: number;
    scoreSaved: boolean;
    startDate: Date;
}
