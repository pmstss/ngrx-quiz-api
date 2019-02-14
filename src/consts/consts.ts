/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
export const SERVER_PORT = process.env.PORT || 4242;
export const COMMENTS_PER_PAGE = 10;
export const SALT_ROUNDS = 3;
export const JWT_TTL = '30m';

let corsOrigin = process.env.CORS_ORIGIN;
if (!corsOrigin) {
    console.error('CORS_ORIGIN env variable must be set, default localhost:4200 will be used');
    corsOrigin = 'http://localhost:4200';
}
export const CORS_ORIGIN = corsOrigin;

let dbUrl = process.env.DB_URL;
if (!dbUrl) {
    console.error('DB_URL env variable must be set, default local mongo will be used');
    dbUrl = 'mongodb://localhost:27017/ngrx-quiz-api';
}
export const DB_URL = dbUrl;

let jwtSecretJey = process.env.JWT_SECRET_KEY;
if (!jwtSecretJey) {
    console.error('JWT_SECRET_KEY env variable must be set, unsecure default will be used');
    jwtSecretJey = 'CHANGEME_JWT_S3CR3T';
}
export const JWT_SECRET_KEY = jwtSecretJey;

let cookieSecretKey = process.env.COOKIE_SECRET_KEY;
if (!cookieSecretKey) {
    console.error('COOKIE_SECRET_KEY env variable must be set, unsecure default will be used');
    cookieSecretKey = 'CHANGEME_COOKIE_S3CR3T';
}
export const COOKIE_SECRET_KEY = cookieSecretKey;

export const OAUTH_TOKEN_CALLBACK_URL = process.env.OAUTH_TOKEN_CALLBACK_URL;
if (!OAUTH_TOKEN_CALLBACK_URL) {
    console.error('OAUTH_TOKEN_CALLBACK_URL env variable must be set');
}

export const OAUTH_GOOGLE_CLIENT_ID = process.env.OAUTH_GOOGLE_CLIENT_ID;
if (!OAUTH_GOOGLE_CLIENT_ID) {
    console.error('OAUTH_GOOGLE_CLIENT_ID env variable must be set');
}

export const OAUTH_GOOGLE_CLIENT_SECRET = process.env.OAUTH_GOOGLE_CLIENT_SECRET;
if (!OAUTH_GOOGLE_CLIENT_SECRET) {
    console.error('OAUTH_GOOGLE_CLIENT_SECRET env variable must be set');
}

export const OAUTH_GITHUB_CLIENT_ID = process.env.OAUTH_GITHUB_CLIENT_ID;
if (!OAUTH_GITHUB_CLIENT_ID) {
    console.error('OAUTH_GITHUB_CLIENT_ID env variable must be set');
}

export const OAUTH_GITHUB_CLIENT_SECRET = process.env.OAUTH_GITHUB_CLIENT_SECRET;
if (!OAUTH_GITHUB_CLIENT_SECRET) {
    console.error('OAUTH_GITHUB_CLIENT_SECRET env variable must be set');
}

export const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
if (!RECAPTCHA_SECRET) {
    console.error('RECAPTCHA_SECRET env variable must be set');
}

export const MAIL_HOST = process.env.MAIL_HOST;
if (!MAIL_HOST) {
    console.error('MAIL_HOST env variable must be set');
}

export const MAIL_PORT = process.env.MAIL_PORT;
if (!MAIL_PORT) {
    console.error('MAIL_PORT env variable must be set');
}

export const MAIL_USER = process.env.MAIL_USER;
if (!MAIL_USER) {
    console.error('MAIL_USER env variable must be set');
}

export const MAIL_PASS = process.env.MAIL_PASS;
if (!MAIL_PASS) {
    console.error('MAIL_PASS env variable must be set');
}

export const MAIL_RESET_URL = process.env.MAIL_RESET_URL;
if (!MAIL_RESET_URL) {
    console.error('MAIL_RESET_URL env variable must be set');
}
