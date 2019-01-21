import { Request, Response, NextFunction } from 'express';
import { StateService } from './state-service';

export const stateGuard = (req: Request, res: Response, next: NextFunction) => {
    (req as any).stateService = new StateService(req);
    next();
};
