import { QuizItemAnswer } from 'ngrx-quiz-common';

export interface ClientQuizState {
    answers: { [itemId: string]: QuizItemAnswer };
}

export interface QuizState extends ClientQuizState {
    itemIds: string[];
    shortName: string;
    score: number;
    scoreSaved: boolean;
    startDate: Date;
}
