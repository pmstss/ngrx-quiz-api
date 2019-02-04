import * as mongoose from 'mongoose';
import { TopScore, QuizPosition } from 'ngrx-quiz-common';
import { QuizScoreModel, QuizScoreDoc, QuizScoreMongooseDoc } from './score-model';

export class ScoreRepo {
    saveScore(quizScore: QuizScoreDoc): Promise<string> {
        return QuizScoreModel.create(quizScore).then((res: QuizScoreMongooseDoc) => res._id);
    }

    getTopScores(quizId: string): Promise<TopScore[]> {
        return QuizScoreModel
            .aggregate()
            .match({
                quizId: mongoose.Types.ObjectId(quizId)
            })
            .addFields({
                userId: {
                    $ifNull: ['$userId', '$sessionId']
                }
            })
            .group({
                _id: { userId: '$userId' },
                score: { $max: '$score' },
                date: { $max: '$date' }/*,
                avgScore: { $avg: '$score' },
                minScore: { $min: '$score' },
                tries: { $sum: 1 }*/
            })
            .limit(10)
            .sort({ score: -1 })
            .replaceRoot({
                $mergeObjects: ['$_id', '$$ROOT']
            })
            .lookup({
                from: 'users',
                let: { id: '$userId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$id']
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            fullName: 1
                        }
                    }
                ],
                as: 'users'
            })
            .replaceRoot({
                $mergeObjects: [{ $arrayElemAt: ['$users', 0] }, '$$CURRENT']
            })
            .addFields({
                userName: {
                    $ifNull: ['$fullName', 'Anonymous']
                }
            })
            .project({
                _id: 0,
                sessionId: 0,
                userId: 0,
                users: 0,
                fullName: 0
            })
            .exec();
    }

    getQuizPosition(quizId: string, score: number) : Promise<QuizPosition> {
        return QuizScoreModel
            .aggregate()
            .match({
                quizId: mongoose.Types.ObjectId(quizId)
            })
            .facet({
                scoreBuckets: [{
                    $bucket: {
                        groupBy: '$score',
                        boundaries: [0, score + 0.01],
                        default: 'greater',
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                }]
            })
            .then((res: any) => {
                const scoreBuckets = res && res[0] && res[0].scoreBuckets;
                return {
                    better: scoreBuckets && scoreBuckets[0] && scoreBuckets[0].count || 0,
                    worse: scoreBuckets && scoreBuckets[1] && scoreBuckets[1].count || 0
                };
            });
    }
}
