import * as mongoose from 'mongoose';
import { Comment } from 'ngrx-quiz-common';
import { ItemCommentModel, ItemCommentDoc, ItemCommentMongooseDoc } from './item-comment-model';
import { ApiError } from '../../api/api-error';
import { COMMENTS_PER_PAGE } from '../../consts/consts';

export class CommentRepo {
    aggregateComments(matchQuery: any, offset: number = 0): mongoose.Aggregate<ItemCommentMongooseDoc[]> {
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
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(COMMENTS_PER_PAGE)
            .project({
                userId: 0,
                itemId: 0,
                users: 0,
                fullName: 0,
                _id: 0,
                __v: 0
            });
    }

    getComments(itemId: string, offset: number): Promise<Comment[]> {
        return this.aggregateComments(
            {
                itemId: mongoose.Types.ObjectId(itemId)
            },
            offset
        ).exec();
    }

    getComment(id: string): Promise<Comment> {
        return this.aggregateComments({
            _id: mongoose.Types.ObjectId(id)
        }).exec().then((res: Comment[]) => {
            if (res.length) {
                return res[0];
            }
            throw new ApiError('No such comment', 404);
        });
    }

    addComment(comment: ItemCommentDoc): Promise<Comment> {
        return ItemCommentModel.create(
            {
                itemId: mongoose.Types.ObjectId(comment.itemId),
                userId: mongoose.Types.ObjectId(comment.userId),
                text: comment.text
            }
        ).then((doc: ItemCommentMongooseDoc) => this.getComment(doc._id));
    }
}
