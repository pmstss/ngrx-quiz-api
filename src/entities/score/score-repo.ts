import * as mongoose from 'mongoose';
import { TopScore, QuizPosition } from 'ngrx-quiz-common';
import { QuizScoreModel, QuizScoreDoc, QuizScoreMongooseDoc } from './score-model';
import { BucketResult } from '../mongo-types';

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
                        default: 'outOfRange',
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                }]
            })
            .unwind('$scoreBuckets')
            .replaceRoot({
                $mergeObjects: ['$scoreBuckets', '$$ROOT']
            })
            .project({
                scoreBuckets: 0
            })
            .then((buckets: BucketResult[]) => ({
                better: buckets && buckets[0] && buckets[0].count || 0,
                worse: buckets && buckets[1] && buckets[1].count || 0
            }));
    }

    getQuizScoreStats(quizId: string, totalQuestions: number) : Promise<number[]> {
        const boundaries = [0, 0.01]; // special bucket for zero score
        for (let i = 1, delta = 1 / totalQuestions; i <= totalQuestions; ++i) {
            boundaries.push(delta * i);
        }
        boundaries[boundaries.length - 1] += 0.01; // to avoid outOfRange for 1.0 score
        console.log(boundaries);

        return QuizScoreModel
            .aggregate()
            .match({
                quizId: mongoose.Types.ObjectId(quizId)
            })
            .facet({
                scoreBuckets: [{
                    $bucket: {
                        boundaries,
                        groupBy: '$score',
                        default: 'outOfRange'
                    }
                }]
            })
            .unwind('$scoreBuckets')
            .replaceRoot({
                $mergeObjects: ['$scoreBuckets', '$$ROOT']
            })
            .project({
                scoreBuckets: 0
            })
            .then((buckets: BucketResult[]) => {
                const total = buckets.reduce((sum: number, b: BucketResult) => sum + b.count, 0);
                return boundaries.slice(0, boundaries.length - 1).map((item: number) => {
                    const bucket = buckets.find((b: BucketResult) => b._id === item);
                    return bucket ? bucket.count / total : 0;
                });
            });
    }
}
