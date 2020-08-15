import {Response, Request} from "express";
import {CharacterModel} from "../Models/CharacterModel";
import {CategoryModel} from "../Models/CategoryModel";
import moment from "moment";
import {User} from "../middlewares/User";
import {Query} from "mysql";

export class UserController {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static login (req: Request, res: Response) {
        res.render('admin/login')
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static register (req: Request, res: Response) {
        res.render('admin/register')
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static loginPOST (req: Request, res: Response): Promise<void> {
        const response = req.body
        const sessionReq = req.session
        return User.login(response, res, sessionReq)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void | Query>
     */
    static registerPOST (req: Request, res: Response): Promise<void | Query> {
        const response = req.body
        return User.register(response, res)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async admin (req: Request, res: Response): Promise<void> {
        if (req.session && !req.session.username) {
            res.redirect('/')
        }
        const characters = await (new CharacterModel()).findAllWithCategory()
        const categories = await (new CategoryModel()).fetchAll()
        res.render('admin/index', {characters, categories, moment})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async listingCharacters (req: Request, res: Response): Promise<void> {
        const characters = await (new CharacterModel()).findAllWithCategory()
        res.render('admin/characters/index', {characters, moment, message: req.flash('success')})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async listingCategories (req: Request, res: Response): Promise<void> {
        const categories = await (new CategoryModel()).fetchAll()
        res.render('admin/categories/index', {categories, moment})
    }
}