import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { quizRouter } from './routes/quiz-router';
import { adminQuizRouter } from './routes/admin-quiz-router';
import { authRouter } from './routes/auth-router';
import { tokenGuard } from './token/token-guard';
import { dbConnect } from './db/db';

const app = express();

app.set('json spaces', 4);
app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/api/admin', tokenGuard, adminQuizRouter);
app.use('/api', tokenGuard, quizRouter);

app.use((req: express.Request, res: express.Response) => {
    res.status(404).send('Not found');
});

app.use((err: Error & {status: number}, req: express.Request, res: express.Response) => {
    res.status(err.status || 500).send(err.message);
});

dbConnect().then(() => {
    app.listen(3333, () => console.log('Listening...'));
});
