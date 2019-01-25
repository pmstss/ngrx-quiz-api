import * as mongoose from 'mongoose';
import { ItemCommentModel, ItemCommentResponse, ItemComment,
    ItemCommentDoc } from '../models/item-comment';

export class CommentRepo {
    aggregateComments(matchQuery: any): mongoose.Aggregate<ItemCommentDoc[]> {
        return ItemCommentModel
            .aggregate()
            .match(matchQuery)
            .lookup({
                from: 'users',
                let: { id: '$userId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$id']
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            fullName: 1
                        }
                    }
                ],
                as: 'users'
            })
            .unwind('$users')
            .replaceRoot({
                $mergeObjects: ['$users', '$$ROOT']
            })
            .addFields({
                id: '$_id',
                userName: '$fullName'
            })
            .project({
                userId: 0,
                itemId: 0,
                users: 0,
                fullName: 0,
                _id: 0,
                __v: 0
            });
    }

    getComments(itemId: string): Promise<ItemCommentResponse[]> {
        return this.aggregateComments({ itemId: mongoose.Types.ObjectId(itemId) }).exec();
    }

    getComment(id: string): Promise<ItemCommentResponse> {
        return this.aggregateComments({
            _id: mongoose.Types.ObjectId(id)
        })
            .exec()
            .then((res: ItemCommentResponse[]) => res[0]);
    }

    addComment(comment: ItemComment): Promise<ItemCommentResponse> {
        return ItemCommentModel.create(
            {
                itemId: mongoose.Types.ObjectId(comment.itemId),
                userId: mongoose.Types.ObjectId(comment.userId),
                text: comment.text
            }
        ).then(doc => this.getComment(doc._id));
    }
}
