/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
// tslint:disable-next-line variable-name
const Filter = require('bad-words');
const filter = new Filter();

export class BanWords {
    static isInsulting(word: String) {
        return filter.isProfane(word);
    }

    static clean(text: String) {
        return filter.clean(text);
    }
}
