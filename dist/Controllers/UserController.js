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
exports.UserController = void 0;
const CharacterModel_1 = require("../Models/CharacterModel");
const CategoryModel_1 = require("../Models/CategoryModel");
const moment_1 = __importDefault(require("moment"));
const User_1 = require("../middlewares/User");
class UserController {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static login(req, res) {
        res.render('admin/login');
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
     *
     * @return Promise<void>
     */
    static admin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session && !req.session.username) {
                res.redirect('/');
            }
            const characters = yield (new CharacterModel_1.CharacterModel()).findAllWithCategory();
            const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            res.render('admin/index', { characters, categories, moment: moment_1.default });
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
            const characters = yield (new CharacterModel_1.CharacterModel()).findAllWithCategory();
            res.render('admin/characters/index', { characters, moment: moment_1.default });
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
            const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            res.render('admin/categories/index', { categories, moment: moment_1.default });
        });
    }
}
exports.UserController = UserController;
