/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { QuizMeta, QuizMetaListItem } from 'ngrx-quiz-common';
import { ApiError } from '../../api/api-error';
import { QuizModel  } from './quiz-model';

export class QuizRepo {
    getQuizList(): Promise<QuizMetaListItem[]> {
        return QuizModel
            .aggregate()
            .match({
                public: true,
                published: true
            })
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
