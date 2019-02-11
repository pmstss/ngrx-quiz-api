import * as mongoose from 'mongoose';

export interface QuizScoreDoc {
    quizId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    sessionId: string;
    score: number;
    createdAt?: Date;
}

export interface QuizScoreMongooseDoc extends QuizScoreDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
export const QuizScoreSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Quiz',
            required: true,
            index: <mongoose.SchemaTypeOpts.IndexOpts>{
                unique: false
            }
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: false,
            default: null
        },
        sessionId: {
            type: mongoose.SchemaTypes.String,
            maxlength: 64,
            required: true
        },
        score: {
            type: mongoose.SchemaTypes.Number,
            min: 0,
            max: 500,
            required: true
        }
    },
    {
        collection: 'scores',
        timestamps: true
    }
);

// tslint:disable-next-line variable-name
export const QuizScoreModel = mongoose.model<QuizScoreMongooseDoc>('QuizScore', QuizScoreSchema);
