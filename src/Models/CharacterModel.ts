import {DB} from "../DB";
import {TextHelper} from "../Helpers/TextHelper";

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
     * @param {string|null} querySearch
     */
    async findSearch(querySearch?: string | null) {
        querySearch = "%" + querySearch + "%"
        let promise = new Promise((resolve: any, reject: any) => {
            const query = "SELECT * FROM characters WHERE name LIKE ?";
            DB.connect().query(query, [querySearch], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {string|null} age
     *
     * @return Promise<any>
     */
    async findByAge(age?: string): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = "SELECT * FROM characters WHERE age = ?";
            DB.connect().query(query, [age], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {string|null} type
     */
    async findBySexe(type?: string) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = "SELECT * FROM characters WHERE sexe = ?";
            DB.connect().query(query, [type], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {number|null} size
     */
    async findBySize(size?: string) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = "SELECT * FROM characters WHERE size = ?";
            DB.connect().query(query, [size], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {string|null} field
     * @param {string|null} order
     *
     * @return Promise<any>
     */
    async findByOrder(field?: string, order?: string): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            let query = `SELECT * FROM characters ORDER BY ${field} ${order}`;
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
    async findAllWithCategory(object?: { limit: Number, orderBy: String }): Promise<any> {
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
     * @param {object} category
     * @param {number} characterID
     *
     * @return Promise<any>
     */
    async findSimilar(limit: number, category: { id: number }, characterID: number): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM characters WHERE category = ? AND id != ? ORDER BY id DESC LIMIT ?';
            DB.connect().query(query, [category.id, characterID, limit], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {number} limit
     * @param {number} offset
     * @param {number|null} category
     *
     *  @return Promise<any>
     */
    async findAllWithPaginate(limit: number, offset: number, category?: number): Promise<any> {
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

    /**
     * @param {string|null} filterName
     *
     * @return Promise<any>
     */
    async filter(filterName?: string): Promise<any> {
        let typeOrderBy = 'ASC'
        if (filterName === 'created_at') {
            typeOrderBy = 'DESC'
        }
        let promise = new Promise((resolve: any, reject: any) => {
            let data = []
            let query = 'SELECT * FROM characters ORDER BY ' + filterName + ' ' + typeOrderBy;

            if (filterName === 'homme' || filterName === 'femme') {
                filterName = TextHelper.UCFirst(filterName)[0]
                data.push(filterName)
                query = 'SELECT * FROM characters WHERE sexe = ?'
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
     * @param {string|number|null} filterID
     *
     * @return Promise<any>
     */
    async filterCategory(filterID?: string | number | null): Promise<any> {
        let promise = new Promise((resolve: any, reject: any) => {
            let query = 'SELECT * FROM characters WHERE category = ?';
            DB.connect().query(query, [filterID], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }
}