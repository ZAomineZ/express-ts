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
class CharacterModel {
    /**
     * @return Promise<void>
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
     * @return Promise<void>
     */
    findAllWithCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                const query = 'SELECT characters.id, characters.name as characterName, category.name as categoryName, characters.content, characters.age, characters.size, characters.image, characters.created_at FROM characters LEFT JOIN category ON characters.category = category.id';
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
}
exports.CharacterModel = CharacterModel;
