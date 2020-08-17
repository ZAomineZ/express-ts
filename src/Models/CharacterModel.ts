import {DB} from "../DB";

export class CharacterModel {

    /**
     * @return Promise<any>
     */
    async findAll(): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM characters';
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
     * @param {number} categoryID
     *
     * @return Promise<any>
     */
    async findAllByCategory(categoryID: number): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM characters WHERE category = ?';
            DB.connect().query(query, [categoryID], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {Object} object
     *
     * @return Promise<any>
     */
    async findAllWithCategory(object?: {limit: Number, orderBy: String}): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            let data = []
            let query = 'SELECT characters.id, characters.name as characterName, category.name as categoryName, characters.content, characters.age, characters.size, characters.image, characters.created_at FROM characters LEFT JOIN category ON characters.category = category.id';
            if (object) {
                query += ' ORDER BY characters.id ' + object?.orderBy + ' LIMIT ?'
                data.push(object?.limit)
            }
            DB.connect().query(query, data, function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {Number} id
     *
     * @return Promise<any>
     */
    async findById(id: Number): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM characters WHERE id = ?';
            DB.connect().query(query, [id], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result[0])
    }

    /**
     * @param {number} limit
     * @param {number} offset
     * @param {number|null} category
     *
     *  @return Promise<any>
     */
    async findAllWithPaginate (limit: number, offset: number, category?: number): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            let data = [limit, offset]
            let query = 'SELECT * FROM characters';
            if (category) {
                query += ' WHERE category = ?'
                data = [category, ...data]
            }
            query += ' LIMIT ? OFFSET ?'
            DB.connect().query(query, data, function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }
}