"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const DB_1 = require("../DB");
class UserModel {
    /**
     * @param {String} name
     *
     * @return Promise<any>
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
    /**
     * @param {string} email
     */
    findByEmail(email) {
        let promise = new Promise((resolve, reject) => {
            const query = 'SELECT id FROM users WHERE email = ?';
            DB_1.DB.connect().query(query, [email], function (error, results) {
                if (error)
                    throw error;
                if (!error) {
                    resolve(results);
                }
            });
        });
        return promise.then((result) => result[0]);
    }
    /**
     * @param {String} name
     *
     * @return Promise<any>
     */
    findByID(id) {
        let promise = new Promise((resolve, reject) => {
            const query = 'SELECT id, username, role FROM users WHERE id = ?';
            DB_1.DB.connect().query(query, [id], function (error, results) {
                if (error)
                    throw error;
                if (!error) {
                    resolve(results);
                }
            });
        });
        return promise.then((result) => result[0]);
    }
    /**
     * @return Promise<any>
     */
    fetchAll() {
        let promise = new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users';
            DB_1.DB.connect().query(query, function (error, results) {
                if (error)
                    throw error;
                if (!error) {
                    resolve(results);
                }
            });
        });
        return promise.then((result) => result);
    }
}
exports.UserModel = UserModel;
