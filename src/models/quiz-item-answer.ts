export interface QuizChoiceAnswerResult {
    id: string;
    explanation: string;
    correct: boolean;
    popularity: number;
}

export interface QuizItemAnswerResult {
    choices: QuizChoiceAnswerResult[];
    correct: boolean;
}
