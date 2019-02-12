/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
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
