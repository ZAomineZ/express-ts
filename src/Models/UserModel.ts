import {DB} from "../DB";

export class UserModel {

    /**
     * @param {String} name
     *
     * @return Promise<any>
     */
    findByName(name: String): Promise<any> {
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

    /**
     * @param {string} email
     */
    findByEmail(email: string): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT id FROM users WHERE email = ?';
            DB.connect().query(query, [email], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            })
        });
        return promise.then((result: any) => result[0])
    }

    /**
     * @param {String} name
     *
     * @return Promise<any>
     */
    findByID(id: number): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT id, username, role FROM users WHERE id = ?';
            DB.connect().query(query, [id], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            })
        });
        return promise.then((result: any) => result[0])
    }

    /**
     * @return Promise<any>
     */
    fetchAll (): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM users';
            DB.connect().query(query, function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            })
        });
        return promise.then((result: any) => result)
    }
}