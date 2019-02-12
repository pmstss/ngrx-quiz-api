/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Request } from 'express';
import { TokenData } from '../token/token-data';
import { StateService } from '../state/state-service';

export interface ApiRequest extends Request {
    tokenData: TokenData;
    stateService: StateService;
}
