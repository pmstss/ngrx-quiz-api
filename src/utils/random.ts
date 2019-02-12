/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
export class RandomUtils {
    static generateAlfaNum(minLength: number, maxLength: number = 64) {
        let pass = '';
        do {
            pass += (Math.random() * Number.MAX_SAFE_INTEGER).toString(36).split('.').join('');
        } while (pass.length < minLength);
        return pass.substr(0, maxLength);
    }
}
