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
        Characters.all(res, req);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async create(req: Request, res: Response): Promise<void> {
        const categories = await (new CategoryModel()).fetchAll();
        res.render('admin/characters/create', {categories})
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
        return Characters.create(response, res, req, reqFile)
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
        const reqFile = req.file
        const flash = req.flash

        return Characters.update(response, params, flash, reqFile, res)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static delete (req: Request, res: Response) {
        return Characters.delete(res, req)
    }
}