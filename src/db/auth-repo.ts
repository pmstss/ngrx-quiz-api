import * as mongoose from 'mongoose';
import { QuizModel } from '../models/quiz';
import { QuizItemModel } from '../models/quiz-item';
import { UserWithPassword, UserModel, User } from '../models/user';

export class AuthRepo {
    getUser(email: string): Promise<UserWithPassword> {
        return UserModel
            .aggregate()
            .match({
                email
            })
            .addFields({
                id: '$._id'
            })
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((res: UserWithPassword[]) => res[0]);
    }

    createUser(user: UserWithPassword): Promise<void> {
        return UserModel.create(
            {
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                admin: false
            }
        ). then(() => { return; });
    }
}
