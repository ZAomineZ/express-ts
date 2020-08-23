import {DB} from "../DB";
import {Request, Response} from "express";
import {Query} from "mysql";
import moment from 'moment'
import {ParamsDictionary} from "express-serve-static-core";
import {CategoryModel} from "../Models/CategoryModel";
import {CharacterModel} from "../Models/CharacterModel";
import paginate from 'express-paginate'
import {Pagination} from "../Helpers/Pagination";
import {CommentModel} from "../Models/CommentModel";

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
                const pagination = new Pagination()
                const paginateData = await pagination.paginate(request, results, CharacterModel)

                return response.render('index.ejs', {
                    characters: paginateData,
                    moment,
                    message: request.flash('success'),
                    pages: paginate.getArrayPages(request)(100, pagination.pageCount, pagination.currentPage),
                    currentPage: pagination.currentPage ? pagination.currentPage : 1
                })
            }
        })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async search(req: Request, res: Response): Promise<void> {
        const query = req.query
        const characters = await (new CharacterModel()).findSearch(query.search)

        const pagination = new Pagination()
        const paginateData = await pagination.paginate(req, characters, CharacterModel)

        return res.render('index.ejs', {
            characters: paginateData,
            moment,
            message: req.flash('success'),
            pages: paginate.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
            currentPage: pagination.currentPage ? pagination.currentPage : 1
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
                const character = results[0]

                const commentModel = new CommentModel()
                let Category = await (new CategoryModel()).findById(character.category);
                let Comments = await commentModel.findByCharacter(character.id)
                Comments = commentModel.commentsWithReply(Comments)

                const characters = await (new CharacterModel()).findSimilar(3, Category, id)
                return response.render('character/show', {character, characters, Comments, moment, Category})
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
     * @param {CallableFunction} flash
     * @param {any} reqFile
     * @param {Response} res
     *
     * @return {Query}
     */
    static async update(response: any, params: ParamsDictionary, flash: CallableFunction, reqFile?: any, res: Response): Promise<Query | void> {
        let category = await (new CategoryModel()).findOrFail(response.category);
        if (!category) {
            flash('danger', 'Aucune catégorie à était sélectionné ou n\'est pas dans notre base de donnée !')
            return res.redirect('/admin/character/update/' + params.id)
        }

        let image = reqFile !== null ? reqFile.filename : null;
        const data = [response.name, response.age, response.size, category.id, response.content, image, new Date(), params.id];
        return DB.connect().query('UPDATE characters SET name = ?, age = ?, size = ?, category = ?, content = ?, image = ?, created_at = ? WHERE id = ?', data, function (error, results, fields) {
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