import { Router } from 'express';
import { TempController } from './temp-controller';

const controller = new TempController();

export const tempRouter = Router();
tempRouter.get('/refresh-ids', controller.refreshChoiceIds.bind(controller));
