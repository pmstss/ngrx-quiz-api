import * as mongoose from 'mongoose';
import { QuizScoreModel, QuizScore } from '../models/quiz-score';

export class ScoreRepo {
    saveScore(quizScore: QuizScore): Promise<any> {
        return QuizScoreModel.create(
            {
                quizId: mongoose.Types.ObjectId(quizScore.quizId),
                sessionId: quizScore.sessionId,
                userId: quizScore.userId ? mongoose.Types.ObjectId(quizScore.userId) : null,
                score: quizScore.score,
                startDate: quizScore.startDate
            });
    }

    getTopScores(quizId: string): Promise<any> {
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
                date: { $max: '$startDate' }/*,
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
                name: {
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
}
