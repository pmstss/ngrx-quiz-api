import { QuizState } from './quiz-state';

export interface SessionState {
    quizes: { [key: string]: QuizState };
}
