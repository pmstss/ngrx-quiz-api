export interface QuizChoiceAnswerResult {
    id: string;
    explanation: string;
    correct: boolean;
    checked: boolean;
    popularity: number;
}

export interface QuizItemAnswerResult {
    choices: QuizChoiceAnswerResult[];
    correct: boolean;
}
