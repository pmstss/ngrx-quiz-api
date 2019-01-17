import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '../models/user';
import { QuizItemAnswerResult } from '../models/quiz-item-answer';
import { TokenData } from './token-data';
import { SECRET_KEY } from '../consts/consts';

export class TokenService {
    constructor(private tokenData: TokenData, private modified: boolean = false) {
    }

    static createForUser(user: User) {
        return new TokenService(
            {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email
                },
                answers: {}
            },
            true
        );
    }

    static verify(token: string): Promise<object | string> {
        if (token && token.startsWith('Bearer ')) {
            // tslint:disable-next-line no-parameter-reassignment
            token = token.substr('Bearer '.length);
        }

        return new Promise((resolve, reject) => {
            verify(
                token,
                SECRET_KEY,
                (err: VerifyErrors, decoded: {[key: string]: any}) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                }
            );
        });
    }

    private static sign(tokenData: TokenData): string {
        console.log('### sec: %o, data: %o', SECRET_KEY, tokenData);
        return sign(
            tokenData,
            SECRET_KEY,
            {
                expiresIn: '1d'
            }
        );
    }

    sign() {
        return TokenService.sign(this.tokenData);
    }

    addAnswer(itemId: string, answerResult: QuizItemAnswerResult) {
        this.tokenData.answers[itemId] = answerResult;
        this.modified = true;
    }

    isModified() {
        return this.modified;
    }
}
