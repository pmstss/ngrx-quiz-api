import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { QuizItemModel } from '../models/quiz-item';

export class TempController {
    refreshChoiceIds(req: Request, res: Response, next: NextFunction) {
        return QuizItemModel.find({}).exec((err, items: mongoose.Document[]) => {
            const itemSaves = items.map((item: mongoose.Document) => {
                const saves = item.get('choices').map((ch: mongoose.Document) => {
                    if (!ch.get('_id')) {
                        ch.set('_id', new mongoose.Types.ObjectId());
                        return ch.save();
                    }

                    return Promise.resolve(true);
                });

                return Promise.all(saves)
                    .then(() => item.save());
            });

            return Promise.all(itemSaves)
                .then(saveRes => res.json(saveRes));
        });
    }
}
