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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
// @ts-ignore
const Promise_1 = __importDefault(require("Promise"));
const DB_1 = require("../DB");
class CategoryModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise_1.default((resolve, reject) => {
                const query = 'SELECT * FROM category';
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
     * @param {string} slug
     */
    findOrFail(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise_1.default((resolve, reject) => {
                const query = 'SELECT id, name FROM category WHERE slug = ?';
                DB_1.DB.connect().query(query, [slug], function (error, results) {
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
     * @param {number} id
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise_1.default((resolve, reject) => {
                const query = 'SELECT * FROM category WHERE id = ?';
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
}
exports.CategoryModel = CategoryModel;
