import * as mongoose from 'mongoose';
import { DB_URL } from '../consts/consts';

// mongoose.set('debug', true);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

export const dbConnect = () => mongoose.connect(DB_URL, { useNewUrlParser: true })
    .then(() => mongoose.connection);
