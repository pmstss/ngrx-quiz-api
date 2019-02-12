/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
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
                        token,
                        used: false
                    }
                },
                {
                    upsert: true
                }
            ).exec()
            .then(() => user);
        });
    }

    updatePassword(token: string, password: string): Promise<UserDocMongoose> {
        // bug similar to https://github.com/Automattic/mongoose/issues/1618
        // findOneAndDelete() does not return removed doc *sometimes*
        return PasswordTokenModel.findOneAndUpdate(
            {
                token,
                used: false
            },
            {
                $set: { used: true }
            }).exec().then((passwordTokenDoc: PasswordTokenDocMongoose) => {
                if (!passwordTokenDoc) {
                    return null;
                }

                return UserModel.findOneAndUpdate(
                    {
                        _id: passwordTokenDoc.userId
                    },
                    {
                        $set: {
                            password
                        }
                    }
                ).exec();
            });
    }
}
