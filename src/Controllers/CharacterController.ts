import {Request, Response} from "express";
import {Characters} from "../middlewares/Characters";
import {CategoryModel} from "../Models/CategoryModel";
import {Query} from "mysql";

export class CharacterController {

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return void
     */
    static index(req: Request, res: Response): void {
        Characters.all(res);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async create(req: Request, res: Response): Promise<void> {
        const categories = await (new CategoryModel()).fetchAll();
        res.render('character/create', {categories})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static createPOST(req: Request, res: Response): Promise<void> {
        const response = req.body;
        const reqFile = req.file;
        return Characters.create(response, res, reqFile)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return void
     */
    static show(req: Request, res: Response): void {
        Characters.show(req, res)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<Query>
     */
    static async edit (req: Request, res: Response): Promise<Query> {
        const categories = await (new CategoryModel()).fetchAll();
        return Characters.edit(req, res, categories)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void | Query>
     */
    static update (req: Request, res: Response): Promise<void | Query> {
        const response = req.body;
        const params = req.params;
        return Characters.update(response, params, res)
    }
}