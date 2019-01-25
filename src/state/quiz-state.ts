import { QuizItemAnswerResult } from '../entities/quiz-item/quiz-item-answer';

export interface ClientQuizState {
    answers: { [itemId: string]: QuizItemAnswerResult };
}

export interface QuizState extends ClientQuizState {
    itemIds: string[];
    shortName: string;
    score: number;
    scoreSaved: boolean;
    startDate: Date;
}
