import {DB} from "../DB";
import {Request, Response} from "express";
import {Query} from "mysql";
import moment from 'moment'
import {ParamsDictionary} from "express-serve-static-core";
import {CategoryModel} from "../Models/CategoryModel";

export class Characters {
    /**
     * @param {any} response
     * @param {Response} res
     * @param {Request} req
     * @param {any|null} reqFile
     *
     *  @return void
     */
    static async create(response: any, res: Response, req: Request, reqFile?: any): Promise<void> {
        let category = await (new CategoryModel()).findOrFail(response.category);
        if (!category) {
            return res.redirect('/character/create')
        }

        let image = reqFile !== null ? reqFile.filename : null;
        const data = [response.name, response.age, response.size, category.id, response.content, image, new Date()];
        DB.connect().query('INSERT INTO characters SET name = ?, age = ?, size = ?, category = ?, content = ?, image = ?, created_at = ?', data, function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                req.flash('success', 'Your character has been created !')
                res.redirect('/')
            }
        })
    }

    /**
     * @return Query
     */
    static all(response: Response, request: Request): Query {
        return DB.connect().query('SELECT * FROM characters', function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                return response.render('index.ejs', {characters: results, moment, message: request.flash('success')})
            }
        })
    }

    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return {Query}
     */
    static async show(request: Request, response: Response): Promise<Query> {
        let id = request.params.id;
        return DB.connect().query('SELECT * FROM characters WHERE id = ?', [id], async function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                let Category = await (new CategoryModel()).findById(results[0].category);
                return response.render('character/show', {character: results[0], moment, Category})
            }
        })
    }

    /**
     * @param {Request} request
     * @param {Response} response
     * @param {Promise<void>} categories
     *
     * @return {Query}
     */
    static async edit(request: Request, response: Response, categories: Promise<void>): Promise<Query> {
        let id = request.params.id;
        return DB.connect().query('SELECT * FROM characters WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                return response.render('admin/characters/edit', {character: results[0], categories})
            }
        })
    }

    /**
     * @param {any} response
     * @param {ParamsDictionary} params
     * @param {Response} res
     *
     * @return {Query}
     */
    static async update(response: any, params: ParamsDictionary, res: Response): Promise<Query|void> {
        let category = await (new CategoryModel()).findOrFail(response.category);
        if (!category) {
            return res.redirect('/character/update/' + params.id)
        }

        const data = [response.name, response.age, response.size, category.id, response.content, new Date(), params.id];
        return DB.connect().query('UPDATE characters SET name = ?, age = ?, size = ?, category = ?, content = ?, created_at = ? WHERE id = ?', data, function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                return res.redirect('/')
            }
        })
    }
}