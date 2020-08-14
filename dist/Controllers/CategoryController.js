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
exports.CategoryController = void 0;
const Category_1 = require("../middlewares/Category");
const CategoryModel_1 = require("../Models/CategoryModel");
const CharacterModel_1 = require("../Models/CharacterModel");
const moment_1 = __importDefault(require("moment"));
class CategoryController {
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return void
     */
    static index(req, res) {
        Category_1.Category.all(res);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static create(req, res) {
        res.render('category/create');
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Query
     */
    static createPOST(req, res) {
        const response = req.body;
        const reqFile = req.file;
        return Category_1.Category.create(response, res, reqFile);
    }
    /**
     * @param req
     * @param res
     *
     * @return Promise<void>
     */
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.params;
            let category = yield (new CategoryModel_1.CategoryModel()).findById(parseInt(params.id));
            let characters = yield (new CharacterModel_1.CharacterModel()).findAll();
            res.render('category/show', { category, characters, moment: moment_1.default });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query>
     */
    static edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.params;
            const category = yield (new CategoryModel_1.CategoryModel()).findById(parseInt(params.id));
            res.render('admin/categories/edit', { category });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query>
     */
    static update(req, res) {
        const response = req.body;
        const reqFile = req.file;
        const params = req.params;
        return Category_1.Category.update(response, res, params, reqFile);
    }
}
exports.CategoryController = CategoryController;