import { UserWithPassword } from 'ngrx-quiz-common';
import { ApiError } from '../../api/api-error';
import { UserModel } from './user-model';

export class AuthRepo {
    getUser(email: string): Promise<UserWithPassword> {
        return UserModel
            .aggregate()
            .match({
                email
            })
            .addFields({
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((res: UserWithPassword[]) => {
                if (res.length) {
                    return res[0];
                }
                throw new ApiError('No such user', 404);
            });
    }

    createUser(user: UserWithPassword): Promise<void> {
        return UserModel.create(
            {
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                admin: false
            }
        ).then(() => {});
    }
}
