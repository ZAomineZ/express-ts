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
exports.Characters = void 0;
const DB_1 = require("../DB");
const moment_1 = __importDefault(require("moment"));
const CategoryModel_1 = require("../Models/CategoryModel");
const CharacterModel_1 = require("../Models/CharacterModel");
const express_paginate_1 = __importDefault(require("express-paginate"));
const Pagination_1 = require("../Helpers/Pagination");
class Characters {
    /**
     * @param {any} response
     * @param {Response} res
     * @param {Request} req
     * @param {any|null} reqFile
     *
     *  @return void
     */
    static create(response, res, req, reqFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield (new CategoryModel_1.CategoryModel()).findOrFail(response.category);
            if (!category) {
                return res.redirect('/character/create');
            }
            let image = reqFile !== null ? reqFile.filename : null;
            const data = [response.name, response.age, response.size, category.id, response.content, image, new Date()];
            DB_1.DB.connect().query('INSERT INTO characters SET name = ?, age = ?, size = ?, category = ?, content = ?, image = ?, created_at = ?', data, function (error, results, fields) {
                if (error)
                    throw error;
                if (!error) {
                    req.flash('success', 'Your character has been created !');
                    res.redirect('/');
                }
            });
        });
    }
    /**
     * @return Promise<Query>
     */
    static all(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.connect().query('SELECT * FROM characters', function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        throw error;
                    if (!error) {
                        // @ts-ignore
                        const pagination = new Pagination_1.Pagination();
                        const paginateData = yield pagination.paginate(request, results, CharacterModel_1.CharacterModel);
                        return response.render('index.ejs', {
                            characters: paginateData,
                            moment: moment_1.default,
                            message: request.flash('success'),
                            pages: express_paginate_1.default.getArrayPages(request)(100, pagination.pageCount, pagination.currentPage),
                            currentPage: pagination.currentPage ? pagination.currentPage : 1
                        });
                    }
                });
            });
        });
    }
    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return {Query}
     */
    static show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = request.params.id;
            return DB_1.DB.connect().query('SELECT * FROM characters WHERE id = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        throw error;
                    if (!error) {
                        let Category = yield (new CategoryModel_1.CategoryModel()).findById(results[0].category);
                        return response.render('character/show', { character: results[0], moment: moment_1.default, Category });
                    }
                });
            });
        });
    }
    /**
     * @param {Request} request
     * @param {Response} response
     * @param {Promise<void>} categories
     *
     * @return {Query}
     */
    static edit(request, response, categories) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = request.params.id;
            return DB_1.DB.connect().query('SELECT * FROM characters WHERE id = ?', [id], function (error, results, fields) {
                if (error)
                    throw error;
                if (!error) {
                    return response.render('admin/characters/edit', { character: results[0], categories });
                }
            });
        });
    }
    /**
     * @param {any} response
     * @param {ParamsDictionary} params
     * @param {Response} res
     *
     * @return {Query}
     */
    static update(response, params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield (new CategoryModel_1.CategoryModel()).findOrFail(response.category);
            if (!category) {
                return res.redirect('/character/update/' + params.id);
            }
            const data = [response.name, response.age, response.size, category.id, response.content, new Date(), params.id];
            return DB_1.DB.connect().query('UPDATE characters SET name = ?, age = ?, size = ?, category = ?, content = ?, created_at = ? WHERE id = ?', data, function (error, results, fields) {
                if (error)
                    throw error;
                if (!error) {
                    return res.redirect('/');
                }
            });
        });
    }
    /**
     * @param {Response} response
     * @param {Request} request
     *
     * @return Promise<Query>
     */
    static delete(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(request.params.id);
            let character = yield (new CharacterModel_1.CharacterModel()).findById(id);
            if (!character) {
                response.redirect('/admin/characters');
            }
            return DB_1.DB.connect().query('DELETE FROM characters WHERE id = ?', [id], function (error) {
                if (error)
                    throw error;
                if (!error) {
                    request.flash('success', 'You are deleted your character !');
                    response.redirect('/admin/characters');
                }
            });
        });
    }
}
exports.Characters = Characters;
