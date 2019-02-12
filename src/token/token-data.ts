/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { User } from 'ngrx-quiz-common';

export interface TokenData {
    user: User;
}

export interface TokenResponse {
    token: string;
}
