import * as mongoose from 'mongoose';

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

export const dbConnect = () => mongoose.connect(
    'mongodb://localhost:27017/quiz-api',
    { useNewUrlParser: true }
);
