/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
import { MailResultModel } from './mail-result-model';

export class MailResultRepo {
    static insertMailResult(userId: string, mailResult: any): Promise<boolean> {
        return MailResultModel.create(
            {
                userId,
                result: mailResult
            }
        ).then(() => true);
    }
}
