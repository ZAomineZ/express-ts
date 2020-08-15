"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class UserModel {
    /**
     * @param {String} name
     */
    findByName(name) {
        let promise = new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE username = ?';
            DB_1.DB.connect().query(query, [name], function (error, results) {
                if (error)
                    throw error;
                if (!error) {
                    resolve(results);
                }
            });
        });
        return promise.then((result) => result[0]);
    }
}
exports.UserModel = UserModel;
