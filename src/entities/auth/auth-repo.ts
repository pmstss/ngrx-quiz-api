import { UserWithPassword, User } from 'ngrx-quiz-common';
import { UserModel, UserDocMongoose } from './user-model';

export class AuthRepo {
    getUser(email: string, social: string = null): Promise<UserWithPassword> {
        return UserModel
            .aggregate()
            .match({
                email,
                social
            })
            .addFields({
                id: '$_id'
            })
            .project({
                _id: 0,
                __v: 0
            })
            .exec()
            .then((res: UserWithPassword[]) => res[0]);
    }

    createUser(user: UserWithPassword): Promise<User> {
        return UserModel.create(
            {
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                social: user.social,
                admin: false
            }
        ).then((userDoc: UserDocMongoose) => ({
            id: userDoc.id,
            fullName: userDoc.fullName,
            email: userDoc.email,
            admin: userDoc.admin,
            social: userDoc.social
        }));
    }
}
