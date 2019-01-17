import { User } from '../models/user';
import { QuizItemAnswerResult } from '../models/quiz-item-answer';

export interface TokenData {
    user: User;
    answers: {
        [key: string]: QuizItemAnswerResult
    };
}
