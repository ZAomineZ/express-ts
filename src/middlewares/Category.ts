import {Response} from "express";
import {DB} from "../DB";
import slugify from 'slugify'
import {Query} from "mysql";
import {CategoryModel} from "../Models/CategoryModel";
import moment from "moment";
import * as fs from "fs";
import {File} from '../Helpers/File'

export class Category {
    /**
     * @param {Response} res
     *
     * @return void
     */
    static async all(res: Response): Promise<void> {
        const categories = await (new CategoryModel()).fetchAll();
        res.render('category/index', {categories, moment})
    }

    /**
     * @param {any} response
     * @param {Response} res
     * @param {any|null} reqFile
     *
     * @return Query
     */
    static create(response: any, res: Response, reqFile?: any): Query {
        let name = response.name;
        let image = reqFile !== null ? reqFile.filename : null;
        let data = [name, slugify(name), response.content, image, new Date()];
        return  DB.connect().query('INSERT INTO category SET name = ?, slug = ?, content = ?, image = ?, created_at = ?', data, function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                res.redirect('/')
            }
        })
    }

    /**
     * @param {any} response
     * @param {Response} res
     * @param {any} params
     * @param {any|null} reqFile
     *
     * @return Promise<Query>
     */
    static async update(response: any, res: Response, params: any, reqFile?: any,): Promise<Query> {
        const category = await (new CategoryModel()).findById(params.id)
        let name = response.name;
        let image = reqFile ? reqFile.filename : category.image;
        if (reqFile) {
            fs.unlink(`${File.getPathBaseName()}/img/category/${category.image}`, function (error) {
                if (error) throw error
            })
        }
        let data = [name, slugify(name), response.content, image, new Date(), params.id];
        return  DB.connect().query('UPDATE category SET name = ?, slug = ?, content = ?, image = ?, created_at = ? WHERE id = ?', data, function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                res.redirect('/admin/categories')
            }
        })
    }
}