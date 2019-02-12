/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { Response, NextFunction } from 'express';
import { StateService } from './state-service';
import { ApiRequest } from '../api/api-request';

export const stateGuard = (req: ApiRequest, res: Response, next: NextFunction) => {
    req.stateService = new StateService(req);
    next();
};
