import { Router } from 'express';
import { TempController } from '../controllers/temp-controller';

const controller = new TempController();

export const tempRouter = Router();
tempRouter.get('/refresh-ids', controller.refreshItemIds.bind(controller));
