// @ts-ignore
import Promise from 'Promise'
import {DB} from "../DB";

export class CategoryModel {

    async fetchAll() {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM category';
            DB.connect().query(query, function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {string} slug
     */
    async findOrFail(slug: string) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT id, name FROM category WHERE slug = ?';
            DB.connect().query(query, [slug], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            })
        });
        return promise.then((result: any) => result[0])
    }

    /**
     * @param {number} id
     */
    async findById(id: number) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM category WHERE id = ?';
            DB.connect().query(query, [id], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            })
        });
        return promise.then((result: any) => result[0])
    }
}