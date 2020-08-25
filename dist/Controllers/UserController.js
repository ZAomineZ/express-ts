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
const CharacterModel_1 = require("../Models/CharacterModel");
const CategoryModel_1 = require("../Models/CategoryModel");
const moment_1 = __importDefault(require("moment"));
const User_1 = require("../middlewares/User");
const Pagination_1 = require("../Helpers/Pagination");
const express_paginate_1 = __importDefault(require("express-paginate"));
const UserModel_1 = require("../Models/UserModel");
class UserController {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static login(req, res) {
        res.render('admin/login', { message: req.flash('success'), danger: req.flash('danger') });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static register(req, res) {
        res.render('admin/register');
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static forget(req, res) {
        res.render('admin/forget', { message: req.flash('success'), danger: req.flash('danger') });
    }
    /**
     * @param {Request} req
     * @param res
     */
    static delete(req, res) {
        return User_1.User.delete(res, req);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static logout(req, res) {
        if (req.cookies.user_sid && req.session && req.session.user) {
            req.session.destroy(function () {
                res.clearCookie('user_sid');
                res.redirect('/');
            });
        }
        else {
            res.redirect('/login');
        }
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static loginPOST(req, res) {
        const response = req.body;
        const sessionReq = req.session;
        return User_1.User.login(response, res, sessionReq);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void | Query>
     */
    static registerPOST(req, res) {
        const response = req.body;
        return User_1.User.register(response, res);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static forgetPOST(req, res) {
        return User_1.User.forget(req, res);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static admin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session && !req.session.user) {
                res.redirect('/admin/login');
            }
            const characters = yield (new CharacterModel_1.CharacterModel()).findAllWithCategory({ limit: 10, orderBy: 'DESC' });
            const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            res.render('admin/index', { characters, categories, moment: moment_1.default });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     *  @return Promise<void>
     */
    static updateRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const user = yield (new UserModel_1.UserModel()).findByID(id);
            res.render('admin/users/role', { user });
        });
    }
    static updateRolePOST(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const params = req.params;
            return User_1.User.updateRole(res, body, params);
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static listingCharacters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield (new CharacterModel_1.CharacterModel()).findAllWithCategory();
            const pagination = new Pagination_1.Pagination();
            const paginateData = yield pagination.paginate(req, results, CharacterModel_1.CharacterModel);
            res.render('admin/characters/index', {
                characters: paginateData,
                moment: moment_1.default,
                message: req.flash('success'),
                danger: req.flash('danger'),
                pages: express_paginate_1.default.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
                currentPage: pagination.currentPage ? pagination.currentPage : 1
            });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static listingCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            const pagination = new Pagination_1.Pagination();
            const paginateData = yield pagination.paginate(req, results, CharacterModel_1.CharacterModel);
            res.render('admin/categories/index', {
                categories: paginateData,
                moment: moment_1.default,
                pages: express_paginate_1.default.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
                currentPage: pagination.currentPage ? pagination.currentPage : 1
            });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static listingUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield (new UserModel_1.UserModel()).fetchAll();
            const pagination = new Pagination_1.Pagination();
            const paginationData = yield pagination.paginate(req, results, UserModel_1.UserModel);
            res.render('admin/users/index', {
                users: paginationData,
                moment: moment_1.default,
                message: req.flash('success'),
                danger: req.flash('danger'),
                pages: express_paginate_1.default.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
                currentPage: pagination.currentPage ? pagination.currentPage : 1
            });
        });
    }
}
exports.UserController = UserController;
