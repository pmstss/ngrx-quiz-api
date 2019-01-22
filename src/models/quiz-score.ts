import * as mongoose from 'mongoose';

export interface QuizScore {
    quizId: string;
    sessionId: string;
    userId: string;
    score: number;
    startDate: Date;
    submitDate?: Date;
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
            required: true
        },
        score: {
            type: mongoose.SchemaTypes.Number,
            min: 0,
            max: 500,
            required: true
        },
        submitDate: {
            type: mongoose.SchemaTypes.Date,
            required: true,
            default: Date.now
        },
        startDate: {
            type: mongoose.SchemaTypes.Date,
            required: true
        }
    },
    {
        collection: 'scores'
    }
);

// tslint:disable-next-line variable-name
export const QuizScoreModel = mongoose.model('QuizScore', QuizScoreSchema);
