import path from "path";

export class File {

    /**
     * @return String
     */
    static getPathBaseName(): String {
        return path.join(__dirname, '../../', 'assets')
    }

}