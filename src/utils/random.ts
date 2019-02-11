export class RandomUtils {
    static generateAlfaNum(minLength: number, maxLength: number = 64) {
        let pass = '';
        do {
            pass += (Math.random() * Number.MAX_SAFE_INTEGER).toString(36).split('.').join('');
        } while (pass.length < minLength);
        return pass.substr(0, maxLength);
    }
}
