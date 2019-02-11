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
