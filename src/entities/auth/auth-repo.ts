import { UserWithPassword, User } from 'ngrx-quiz-common';
import { UserModel, UserDocMongoose, hashPassword } from './user-model';
import { PasswordTokenModel, PasswordTokenDocMongoose } from './password-token-model';

export class AuthRepo {
    private findUser(criteria: any): Promise<UserWithPassword> {
        return UserModel
            .aggregate()
            .match(criteria)
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

    getUser(email: string, social: string = null): Promise<UserWithPassword> {
        return this.findUser({
            email,
            social
        });
    }

    createUser(user: UserWithPassword): Promise<User> {
        return UserModel.create(
            {
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                social: user.social,
                admin: false,
                anonymous: user.anonymous
            }
        ).then((userDoc: UserDocMongoose) => ({
            id: userDoc.id,
            fullName: userDoc.fullName,
            email: userDoc.email,
            admin: userDoc.admin,
            social: userDoc.social,
            anonymous: userDoc.anonymous
        }));
    }

    upsertPasswordToken(email: string, token: string): Promise<UserWithPassword> {
        return this.findUser({
            email,
            social: null,
            anonymous: false
        }).then((user: UserWithPassword) => {
            if (!user) {
                return null;
            }

            return PasswordTokenModel.findOneAndUpdate(
                {
                    userId: user.id
                },
                {
                    $set: {
                        token
                    }
                },
                {
                    upsert: true
                }
            ).exec()
            .then(() => user);
        });
    }

    updatePassword(token: string, password: string): Promise<boolean> {
        return PasswordTokenModel.findOneAndDelete({
            token
        }).then((passwordTokenDoc: PasswordTokenDocMongoose) => {
            if (!passwordTokenDoc) {
                return false;
            }

            return UserModel.findOneAndUpdate(
                {
                    _id: passwordTokenDoc.userId
                },
                {
                    $set: {
                        password: hashPassword(password)
                    }
                }
            ).exec()
            .then(doc => !!doc);
        });
    }
}
