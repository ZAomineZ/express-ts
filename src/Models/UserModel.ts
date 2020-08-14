import {DB} from "../DB";

export class UserModel {

    /**
     * @param {String} name
     */
    findByName(name: String) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM users WHERE username = ?';
            DB.connect().query(query, [name], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            })
        });
        return promise.then((result: any) => result[0])
    }
}