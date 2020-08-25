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
const DB_1 = require("../DB");
const moment_1 = __importDefault(require("moment"));
const CategoryModel_1 = require("../Models/CategoryModel");
const CharacterModel_1 = require("../Models/CharacterModel");
const express_paginate_1 = __importDefault(require("express-paginate"));
const Pagination_1 = require("../Helpers/Pagination");
const CommentModel_1 = require("../Models/CommentModel");
const CharacterHTML_1 = require("../HTML/CharacterHTML");
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
            const data = [response.name, response.age, response.sexe, response.size, category.id, response.content, image, new Date()];
            DB_1.DB.connect().query('INSERT INTO characters SET name = ?, age = ?, sexe = ?, size = ?, category = ?, content = ?, image = ?, created_at = ?', data, function (error, results, fields) {
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
                        const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
                        return response.render('index.ejs', {
                            characters: paginateData,
                            categories,
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
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const characters = yield (new CharacterModel_1.CharacterModel()).findSearch(query.search);
            const pagination = new Pagination_1.Pagination();
            const paginateData = yield pagination.paginate(req, characters, CharacterModel_1.CharacterModel);
            return res.render('index.ejs', {
                characters: paginateData,
                categories: null,
                moment: moment_1.default,
                message: req.flash('success'),
                pages: express_paginate_1.default.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
                currentPage: pagination.currentPage ? pagination.currentPage : 1
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
            let id = parseInt(request.params.id);
            return DB_1.DB.connect().query('SELECT * FROM characters WHERE id = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        throw error;
                    if (!error) {
                        const character = results[0];
                        const commentModel = new CommentModel_1.CommentModel();
                        let Category = yield (new CategoryModel_1.CategoryModel()).findById(character.category);
                        let Comments = yield commentModel.findByCharacter(character.id);
                        Comments = commentModel.commentsWithReply(Comments);
                        const characters = yield (new CharacterModel_1.CharacterModel()).findSimilar(3, Category, id);
                        const message = request.flash('message');
                        const danger = request.flash('danger');
                        return response.render('character/show', { character, characters, Comments, moment: moment_1.default, Category, message, danger });
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
     * @param {CallableFunction} flash
     * @param {any} reqFile
     * @param {Response} res
     *
     * @return {Query}
     */
    static update(response, params, flash, reqFile, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield (new CategoryModel_1.CategoryModel()).findOrFail(response.category);
            if (!category) {
                //flash('danger', 'Aucune catégorie à était sélectionné ou n\'est pas dans notre base de donnée !')
                return res.redirect('/admin/character/update/' + params.id);
            }
            const character = yield (new CharacterModel_1.CharacterModel()).findById(parseInt(params.id));
            let image = reqFile ? reqFile.filename : character.image;
            const data = [response.name, response.age, response.sexe, response.size, category.id, response.content, image, new Date(), params.id];
            return DB_1.DB.connect().query('UPDATE characters SET name = ?, age = ?, sexe = ?, size = ?, category = ?, content = ?, image = ?, created_at = ? WHERE id = ?', data, function (error, results, fields) {
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
     * @return Promise<Query | void>
     */
    static delete(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(request.params.id);
            let character = yield (new CharacterModel_1.CharacterModel()).findById(id);
            if (!character) {
                return response.redirect('/admin/characters');
            }
            // if (request.session && request.session.csrfSecret !== request.csrfToken()) {
            //     return response.redirect('/')
            // }
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
    /**
     * @param {Response} response
     * @param {Request} request
     * @param {boolean} category
     *
     * @return Promise<Response>
     */
    static filter(response, request, category = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = request.params;
            let filterName = !category ? params.name : params.id;
            let characters = !category ? yield (new CharacterModel_1.CharacterModel()).filter(filterName) : yield (new CharacterModel_1.CharacterModel()).filterCategory(filterName);
            characters = CharacterHTML_1.CharacterHTML.setCharacter(characters);
            return response.json({
                success: true,
                characters
            });
        });
    }
    /**
     * @param {Response} response
     * @param {Request} request
     */
    static filterCategory(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return Characters.filter(response, request, true);
        });
    }
}
exports.Characters = Characters;
