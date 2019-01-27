import { QuizMeta } from 'ngrx-quiz-common';
import { QuizModel  } from './quiz-model';
import { ApiError } from '../../api/api-error';

export class QuizRepo {
    getQuizList(): Promise<(QuizMeta & {totalQuestions: number})[]> {
        return QuizModel
            .aggregate()
            .lookup({
                from: 'items',
                localField: '_id',
                foreignField: 'quizId',
                as: 'items'
            })
            .addFields({
                id: '$_id',
                totalQuestions: { $size: '$items' }
            })
            .project({
                _id: 0,
                __v: 0,
                items: 0
            })
            .exec();
    }

    getQuiz(shortName: string): Promise<QuizMeta> {
        return QuizModel
            .aggregate()
            .match({
                shortName
            })
            .lookup({
                from: 'items',
                localField: '_id',
                foreignField: 'quizId',
                as: 'items'
            })
            .addFields({
                itemIds: {
                    $map: {
                        input: '$items',
                        as: 'x',
                        in: '$$x._id'
                    }
                },
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0,
                items: 0
            })
            .exec()
            .then((res: QuizMeta[]) => {
                if (res.length) {
                    return res[0];
                }
                throw new ApiError('No such quiz', 404);
            });
    }
}
