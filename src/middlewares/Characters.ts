import {DB} from "../DB";
import {Request, Response} from "express";
import {Query} from "mysql";
import moment from 'moment'
import {ParamsDictionary} from "express-serve-static-core";
import {CategoryModel} from "../Models/CategoryModel";
import {CharacterModel} from "../Models/CharacterModel";
import paginate from 'express-paginate'

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
     * @return Promise<Query>
     */
    static async all(response: Response, request: Request): Promise<Query> {
        return DB.connect().query('SELECT * FROM characters', async function (error, results, fields) {
            if (error) throw error;
            if (!error) {
                // @ts-ignore
                const currentPage = parseInt(request.query.page)
                const limit = 10
                const pageCount = Math.ceil(results.length / limit)
                const offset = currentPage === 1 ? 0 : (limit *  currentPage - limit)

                let characters = await (new CharacterModel()).findAllWithPaginate(limit, offset)
                return response.render('index.ejs', {
                    characters,
                    moment,
                    message: request.flash('success'),
                    pages: paginate.getArrayPages(request)(100, pageCount, currentPage),
                    currentPage: currentPage ? currentPage : 1
                })
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

    /**
     * @param {Response} response
     * @param {Request} request
     *
     * @return Promise<Query>
     */
    static async delete(response: Response, request: Request): Promise<Query> {
        const id = parseInt(request.params.id)
        let character = await (new CharacterModel()).findById(id)
        if (!character) {
            response.redirect('/admin/characters')
        }

        return DB.connect().query('DELETE FROM characters WHERE id = ?', [id], function (error) {
            if (error) throw error
            if (!error) {
                request.flash('success', 'You are deleted your character !')
                response.redirect('/admin/characters')
            }
        })
    }
}