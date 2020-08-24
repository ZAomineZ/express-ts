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
exports.CharacterController = void 0;
const Characters_1 = require("../middlewares/Characters");
const CategoryModel_1 = require("../Models/CategoryModel");
class CharacterController {
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return void
     */
    static index(req, res) {
        Characters_1.Characters.all(res, req);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static search(req, res) {
        return Characters_1.Characters.search(req, res);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            res.render('admin/characters/create', { categories });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static createPOST(req, res) {
        const response = req.body;
        const reqFile = req.file;
        return Characters_1.Characters.create(response, res, req, reqFile);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return void
     */
    static show(req, res) {
        Characters_1.Characters.show(req, res);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query>
     */
    static edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            return Characters_1.Characters.edit(req, res, categories);
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void | Query>
     */
    static update(req, res) {
        const response = req.body;
        const params = req.params;
        const reqFile = req.file;
        const flash = req.flash;
        return Characters_1.Characters.update(response, params, flash, reqFile, res);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query | void>
     */
    static delete(req, res) {
        return Characters_1.Characters.delete(res, req);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static filter(req, res) {
        return Characters_1.Characters.filter(res, req);
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static filterCategory(req, res) {
        return Characters_1.Characters.filterCategory(res, req);
    }
}
exports.CharacterController = CharacterController;
