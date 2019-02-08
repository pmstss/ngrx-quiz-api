import { User } from 'ngrx-quiz-common';

export interface TokenData {
    user: User;
}

export interface TokenResponse {
    token: string;
}
