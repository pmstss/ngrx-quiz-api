import { Response, NextFunction } from 'express';
import { StateService } from './state-service';
import { ApiRequest } from '../api/api-request';

export const stateGuard = (req: ApiRequest, res: Response, next: NextFunction) => {
    req.stateService = new StateService(req);
    next();
};
