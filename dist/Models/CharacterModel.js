"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
const TextHelper_1 = require("../Helpers/TextHelper");
class CharacterModel {
    /**
     * @return Promise<any>
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM characters';
                DB_1.DB.connect().query(query, function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {string|null} querySearch
     */
    findSearch(querySearch) {
        return __awaiter(this, void 0, void 0, function* () {
            querySearch = "%" + querySearch + "%";
            let promise = new Promise((resolve, reject) => {
                const query = "SELECT * FROM characters WHERE name LIKE ?";
                DB_1.DB.connect().query(query, [querySearch], function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {number} categoryID
     *
     * @return Promise<any>
     */
    findAllByCategory(categoryID) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM characters WHERE category = ?';
                DB_1.DB.connect().query(query, [categoryID], function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {Object} object
     *
     * @return Promise<any>
     */
    findAllWithCategory(object) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                let data = [];
                let query = 'SELECT characters.id, characters.name as characterName, category.name as categoryName, characters.content, characters.age, characters.size, characters.image, characters.created_at FROM characters LEFT JOIN category ON characters.category = category.id';
                if (object) {
                    query += ' ORDER BY characters.id ' + (object === null || object === void 0 ? void 0 : object.orderBy) + ' LIMIT ?';
                    data.push(object === null || object === void 0 ? void 0 : object.limit);
                }
                DB_1.DB.connect().query(query, data, function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {Number} id
     *
     * @return Promise<any>
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM characters WHERE id = ?';
                DB_1.DB.connect().query(query, [id], function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result[0]);
        });
    }
    /**
     * @param {number} limit
     * @param {object} category
     * @param {number} characterID
     *
     * @return Promise<any>
     */
    findSimilar(limit, category, characterID) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM characters WHERE category = ? AND id != ? ORDER BY id DESC LIMIT ?';
                DB_1.DB.connect().query(query, [category.id, characterID, limit], function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {number} limit
     * @param {number} offset
     * @param {number|null} category
     *
     *  @return Promise<any>
     */
    findAllWithPaginate(limit, offset, category) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                let data = [limit, offset];
                let query = 'SELECT * FROM characters';
                if (category) {
                    query += ' WHERE category = ?';
                    data = [category, ...data];
                }
                query += ' LIMIT ? OFFSET ?';
                DB_1.DB.connect().query(query, data, function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {string|null} filterName
     *
     * @return Promise<any>
     */
    filter(filterName) {
        return __awaiter(this, void 0, void 0, function* () {
            let typeOrderBy = 'ASC';
            if (filterName === 'created_at') {
                typeOrderBy = 'DESC';
            }
            let promise = new Promise((resolve, reject) => {
                let data = [];
                let query = 'SELECT * FROM characters ORDER BY ' + filterName + ' ' + typeOrderBy;
                if (filterName === 'homme' || filterName === 'femme') {
                    filterName = TextHelper_1.TextHelper.UCFirst(filterName)[0];
                    data.push(filterName);
                    query = 'SELECT * FROM characters WHERE sexe = ?';
                }
                DB_1.DB.connect().query(query, data, function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
    /**
     * @param {string|number|null} filterID
     *
     * @return Promise<any>
     */
    filterCategory(filterID) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                let query = 'SELECT * FROM characters WHERE category = ?';
                DB_1.DB.connect().query(query, [filterID], function (error, results) {
                    if (error)
                        throw error;
                    if (!error) {
                        resolve(results);
                    }
                });
            });
            return promise.then((result) => result);
        });
    }
}
exports.CharacterModel = CharacterModel;
