import {Category} from "../middlewares/Category";
import {Request, Response} from "express";
import {CategoryModel} from "../Models/CategoryModel";
import {CharacterModel} from "../Models/CharacterModel";
import moment from "moment";
import {Characters} from "../middlewares/Characters";
import {Query} from "mysql";

export class CategoryController {

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return void
     */
    static index (req: Request, res: Response): void {
        Category.all(res)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static create (req: Request, res: Response): void {
        res.render('category/create')
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Query
     */
    static createPOST (req: Request, res: Response): Query {
        const response = req.body;
        const reqFile = req.file;
        return Category.create(response, res, reqFile)
    }

    /**
     * @param req
     * @param res
     *
     * @return Promise<void>
     */
    static async show (req: Request, res: Response): Promise<void> {
        const params = req.params;

        let category = await (new CategoryModel()).findById(parseInt(params.id));
        let characters = await (new CharacterModel()).findAll();
        res.render('category/show', {category, characters, moment})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query>
     */
    static async edit (req: Request, res: Response): Promise<void> {
        const params = req.params
        const category = await (new CategoryModel()).findById(parseInt(params.id))
        res.render('admin/categories/edit', {category})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query>
     */
    static update (req: Request, res: Response): Promise<Query> {
        const response = req.body;
        const reqFile = req.file;
        const params = req.params
        return Category.update(response, res, params, reqFile)
    }

}