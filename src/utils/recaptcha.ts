/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
const fetch = require('node-fetch');
import { RECAPTCHA_SECRET } from '../consts/consts';

export interface RecaptchaResponse {
    success: boolean;
    challenge_ts: string;  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    hostname: string;      // the hostname of the site where the reCAPTCHA was solved
    'error-codes': any[];  // optional
}

export function verifyRecaptcha(captchaToken: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET);
    params.append('response', captchaToken);

    return fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: params
    })
        .then((response: any) => response.json())
        .then((recaptchaResponse: RecaptchaResponse) => recaptchaResponse.success);
}
