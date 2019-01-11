import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { QuizItemModel } from '../models/quiz-item';

export class TempController {
    refreshChoiceIds(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel.findById(req.params.itemId).exec((err, item) => {
            const saves = item.get('choices').map((ch: mongoose.Document) => {
                ch.set('_id', new mongoose.Types.ObjectId());
                return ch.save();
            });

            return Promise.all(saves)
                .then(() => item.save())
                .then(saveRes => res.json(saveRes));
        });
    }

    refreshItemIds(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel.find({}).exec((err, items) => {
            console.log(items);
            const saves = items.map((item: mongoose.Document) => {
                console.log(item);
                item.set('_id', new mongoose.Types.ObjectId());
                return item.save();
            });

            return Promise.all(saves)
                .then(saveRes => res.json({ success: true }));
        });
    }
}
