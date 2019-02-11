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
