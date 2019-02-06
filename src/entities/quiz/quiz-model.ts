import * as mongoose from 'mongoose';

export interface QuizDoc {
    name: string;
    shortName: string;
    description: string;
    descriptionFull: string;
    randomizeItems: boolean;
    userId: string;
    published: boolean;
    public: boolean;
}

export interface QuizMongooseDoc extends QuizDoc, mongoose.Document {
}

// tslint:disable-next-line variable-name
export const QuizSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 128,
            required: true
        },
        shortName: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            required: true,
            maxlength: 64,
            index: {
                unique: true
            }
        },
        description: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 1024,
            required: true
        },
        descriptionFull: {
            type: mongoose.SchemaTypes.String,
            trim: true,
            maxlength: 2048,
            required: true
        },
        randomizeItems: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        published: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        },
        public: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        }
    },
    {
        collection: 'quizes'
    }
);

// tslint:disable-next-line variable-name
export const QuizModel = mongoose.model<QuizMongooseDoc>('Quiz', QuizSchema);
