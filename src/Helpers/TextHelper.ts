export class TextHelper {

    /**
     * @param {string} str
     * @constructor
     */
    static UCFirst(str: string) {
        return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : str;
    }
}