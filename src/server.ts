import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { CORS_ORIGIN, COOKIE_SECRET_KEY } from './consts/consts';
import { dbConnect } from './db/db';
import { tokenGuard } from './token/token-guard';
import { stateGuard } from './state/state-guard';
import { authRouter } from './routes/auth-router';
import { quizRouter } from './routes/quiz-router';
import { adminQuizRouter } from './routes/admin-quiz-router';
import { adminQuizItemRouter } from './routes/admin-quiz-item-router';
import { commentRouter } from './routes/comment-router';
import { tempRouter } from './routes/temp-router';
import { quizItemRouter } from './routes/quiz-item-router';

// tslint:disable-next-line variable-name
const MongoStore = require('connect-mongo')(session);

(async () => {
    const connection = await dbConnect();
    const app = express();

    app.set('json spaces', 4);
    app.use(cors({
        origin: CORS_ORIGIN,
        credentials: true
    }));

    app.use(morgan('dev'));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

    app.use(session({
        secret: COOKIE_SECRET_KEY,
        store: new MongoStore({
            mongooseConnection: connection
        }),
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            secure: false
        }
    }));

    app.use('/auth', authRouter);
    app.use('/temp', tempRouter);
    app.use('/api/admin/quizes', tokenGuard, adminQuizRouter);
    app.use('/api/admin/items', tokenGuard, adminQuizItemRouter);
    app.use('/api/comments', stateGuard, tokenGuard, commentRouter);
    app.use('/api/quizes', stateGuard, tokenGuard, quizRouter);
    app.use('/api/items', stateGuard, tokenGuard, quizItemRouter);

    app.use((req: express.Request, res: express.Response) => {
        res.status(404).send('Not found');
    });

    app.use((err: Error & {status: number}, req: express.Request, res: express.Response) => {
        res.status(err.status || 500).send(err.message);
    });

    app.listen(3333, () => console.log('Listening...'));
})();
