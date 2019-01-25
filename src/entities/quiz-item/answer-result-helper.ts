import { ApiError } from '../../api/api-error';
import { QuizItem } from './quiz-item-model';
import { QuizItemAnswerResult } from './quiz-item-answer';
import { QuizItemChoice } from './quiz-item-choice-model';

export class AnswerResultHelper {
    static arrayEqual(array1: any[], array2: any[]) {
        return [...array1].sort().join(' ') === [...array2].sort().join(' ');
    }

    static create(userChoiceIds: string[], doc: QuizItem): QuizItemAnswerResult {
        if (!doc) {
            throw new ApiError('Item not found', 404);
        }

        const choices: QuizItemChoice[] = doc.choices;
        const totalAnswers = choices.reduce((sum, ch) => sum + ch.counter, 0);

        return {
            choices: choices.map((choice: QuizItemChoice) => {
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
