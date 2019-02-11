import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { CORS_ORIGIN, COOKIE_SECRET_KEY } from './consts/consts';
import { dbConnect } from './db/db';
import { Mailer } from './mail/mailer';
import { tokenGuard } from './token/token-guard';
import { stateGuard } from './state/state-guard';
import { authRouter } from './entities/auth/auth-router';
import { quizRouter } from './entities/quiz/quiz-router';
import { adminQuizRouter } from './entities/admin-quiz/admin-quiz-router';
import { adminQuizItemRouter } from './entities/admin-quiz-item/admin-quiz-item-router';
import { itemCommentRouter } from './entities/item-comment/item-comment-router';
import { quizItemRouter } from './entities/quiz-item/quiz-item-router';
import { oauthRouter } from './entities/oauth/oauth-router';
import { quizScoreRouter } from './entities/score/score-router';

// tslint:disable-next-line variable-name
const MongoStore = require('connect-mongo')(session);

(async () => {
    let connection;
    try {
        connection = await dbConnect();
    } catch (e) {
        console.error('db connection error', e);
        process.exit(-2);
    }

    try {
        await Mailer.getInstance().verify();
    } catch (e) {
        console.error('SMTP initialization error', e);
        process.exit(-3);
    }

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
    app.use('/oauth', oauthRouter);
    app.use('/api/admin/quizes', tokenGuard, adminQuizRouter);
    app.use('/api/admin/items', tokenGuard, adminQuizItemRouter);
    app.use('/api/comments', stateGuard, tokenGuard, itemCommentRouter);
    app.use('/api/quizes', stateGuard, quizRouter); // tokenGuard is inside router - not for all routes
    app.use('/api/items', stateGuard, tokenGuard, quizItemRouter);
    app.use('/api/scores', stateGuard, tokenGuard, quizScoreRouter);

    app.use((req: express.Request, res: express.Response) => {
        res.status(404).send('Not found');
    });

    app.use((err: Error & {status: number}, req: express.Request, res: express.Response) => {
        res.status(err.status || 500).send(err.message);
    });

    app.listen(3333, () => console.log('Listening...'));
})();
