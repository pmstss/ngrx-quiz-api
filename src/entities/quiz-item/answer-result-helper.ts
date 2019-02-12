/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { ApiError } from '../../api/api-error';
import { QuizItemAdmin, QuizItemAnswer, QuizItemChoiceAdmin } from 'ngrx-quiz-common';

export class AnswerResultHelper {
    static arrayEqual(array1: any[], array2: any[]) {
        return [...array1].sort().join(' ') === [...array2].sort().join(' ');
    }

    static create(userChoiceIds: string[], doc: QuizItemAdmin): QuizItemAnswer {
        if (!doc) {
            throw new ApiError('Item not found', 404);
        }

        const choices: QuizItemChoiceAdmin[] = doc.choices;
        const totalAnswers = choices.reduce((sum, ch) => sum + ch.counter, 0);

        return {
            choices: choices.map((choice: QuizItemChoiceAdmin) => {
                const checked = userChoiceIds.includes(choice.id);
                return {
                    checked,
                    id: choice.id,
                    explanation: checked && choice.explanation,
                    correct: choice.correct,
                    popularity: choice.counter / totalAnswers
                };
            }),
            correct: AnswerResultHelper.arrayEqual(
                userChoiceIds,
                choices.filter(ch => ch.correct).map(ch => ch.id)
            )
        };
    }
}
