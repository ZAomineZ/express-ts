"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Category = void 0;
const DB_1 = require("../DB");
const slugify_1 = __importDefault(require("slugify"));
const CategoryModel_1 = require("../Models/CategoryModel");
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
const File_1 = require("../Helpers/File");
class Category {
    /**
     * @param {Response} res
     *
     * @return void
     */
    static all(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield (new CategoryModel_1.CategoryModel()).fetchAll();
            res.render('category/index', { categories, moment: moment_1.default });
        });
    }
    /**
     * @param {any} response
     * @param {Response} res
     * @param {any|null} reqFile
     *
     * @return Query
     */
    static create(response, res, reqFile) {
        let name = response.name;
        let image = reqFile !== null ? reqFile.filename : null;
        let data = [name, slugify_1.default(name), response.content, image, new Date()];
        return DB_1.DB.connect().query('INSERT INTO category SET name = ?, slug = ?, content = ?, image = ?, created_at = ?', data, function (error, results, fields) {
            if (error)
                throw error;
            if (!error) {
                res.redirect('/');
            }
        });
    }
    /**
     * @param {any} response
     * @param {Response} res
     * @param {any} params
     * @param {any|null} reqFile
     *
     * @return Promise<Query>
     */
    static update(response, res, params, reqFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield (new CategoryModel_1.CategoryModel()).findById(params.id);
            let name = response.name;
            let image = reqFile ? reqFile.filename : category.image;
            if (reqFile) {
                fs.unlink(`${File_1.File.getPathBaseName()}/img/category/${category.image}`, function (error) {
                    if (error)
                        throw error;
                });
            }
            let data = [name, slugify_1.default(name), response.content, image, new Date(), params.id];
            return DB_1.DB.connect().query('UPDATE category SET name = ?, slug = ?, content = ?, image = ?, created_at = ? WHERE id = ?', data, function (error, results, fields) {
                if (error)
                    throw error;
                if (!error) {
                    res.redirect('/admin/categories');
                }
            });
        });
    }
}
exports.Category = Category;
