export const COMMENTS_PER_PAGE = 10;

export const SALT_ROUNDS = 3;

export const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
    console.error('BASE_URL env variable must be set');
    process.exit(-1);
}

export const CORS_ORIGIN = process.env.CORS_ORIGIN;
if (!CORS_ORIGIN) {
    console.error('CORS_ORIGIN env variable must be set');
    process.exit(-1);
}

export const DB_URL = process.env.DB_URL;
if (!DB_URL) {
    console.error('DB_URL env variable must be set');
    process.exit(-1);
}

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY env variable must be set');
    process.exit(-1);
}

export const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;
if (!COOKIE_SECRET_KEY) {
    console.error('COOKIE_SECRET_KEY env variable must be set');
    process.exit(-1);
}

export const OAUTH_TOKEN_CALLBACK_URL = process.env.OAUTH_TOKEN_CALLBACK_URL;
if (!OAUTH_TOKEN_CALLBACK_URL) {
    console.error('OAUTH_TOKEN_CALLBACK_URL env variable must be set');
    process.exit(-1);
}

export const OAUTH_GOOGLE_CLIENT_ID = process.env.OAUTH_GOOGLE_CLIENT_ID;
if (!OAUTH_GOOGLE_CLIENT_ID) {
    console.error('OAUTH_GOOGLE_CLIENT_ID env variable must be set');
    process.exit(-1);
}

export const OAUTH_GOOGLE_CLIENT_SECRET = process.env.OAUTH_GOOGLE_CLIENT_SECRET;
if (!OAUTH_GOOGLE_CLIENT_SECRET) {
    console.error('OAUTH_GOOGLE_CLIENT_SECRET env variable must be set');
    process.exit(-1);
}

export const OAUTH_GITHUB_CLIENT_ID = process.env.OAUTH_GITHUB_CLIENT_ID;
if (!OAUTH_GITHUB_CLIENT_ID) {
    console.error('OAUTH_GITHUB_CLIENT_ID env variable must be set');
    process.exit(-1);
}

export const OAUTH_GITHUB_CLIENT_SECRET = process.env.OAUTH_GITHUB_CLIENT_SECRET;
if (!OAUTH_GITHUB_CLIENT_SECRET) {
    console.error('OAUTH_GITHUB_CLIENT_SECRET env variable must be set');
    process.exit(-1);
}

export const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
if (!RECAPTCHA_SECRET) {
    console.error('RECAPTCHA_SECRET env variable must be set');
    process.exit(-1);
}

export const MAIL_HOST = process.env.MAIL_HOST;
if (!MAIL_HOST) {
    console.error('MAIL_HOST env variable must be set');
    process.exit(-1);
}

export const MAIL_PORT = process.env.MAIL_PORT;
if (!MAIL_PORT) {
    console.error('MAIL_PORT env variable must be set');
    process.exit(-1);
}

export const MAIL_USER = process.env.MAIL_USER;
if (!MAIL_USER) {
    console.error('MAIL_USER env variable must be set');
    process.exit(-1);
}

export const MAIL_PASS = process.env.MAIL_PASS;
if (!MAIL_PASS) {
    console.error('MAIL_PASS env variable must be set');
    process.exit(-1);
}

export const MAIL_RESET_URL = process.env.MAIL_RESET_URL;
if (!MAIL_RESET_URL) {
    console.error('MAIL_RESET_URL env variable must be set');
    process.exit(-1);
}
