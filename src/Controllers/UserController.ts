import {Response, Request} from "express";
import {CharacterModel} from "../Models/CharacterModel";
import {CategoryModel} from "../Models/CategoryModel";
import moment from "moment";
import {User} from "../middlewares/User";
import {Query} from "mysql";
import {Pagination} from "../Helpers/Pagination";
import paginate from "express-paginate";
import {UserModel} from "../Models/UserModel";

export class UserController {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static login (req: Request, res: Response) {
        res.render('admin/login', {message: req.flash('success'), danger: req.flash('danger')})
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
    static forget (req: Request, res: Response) {
        res.render('admin/forget', {message: req.flash('success'), danger: req.flash('danger')})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static logout(req: Request, res: Response) {
        if (req.cookies.user_sid && req.session && req.session.user) {
            res.clearCookie('user_sid')
            res.redirect('/')
        } else {
            res.redirect('/login')
        }
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
     */
    static forgetPOST (req: Request, res: Response) {
        return User.forget(req, res)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async admin (req: Request, res: Response): Promise<void> {
        if (req.session && !req.session.user) {
            res.redirect('/admin/login')
        }
        const characters = await (new CharacterModel()).findAllWithCategory({limit: 10, orderBy: 'DESC'})
        const categories = await (new CategoryModel()).fetchAll()
        res.render('admin/index', {characters, categories, moment})
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     *  @return Promise<void>
     */
    static async updateRole (req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id)
        const user = await (new UserModel()).findByID(id)
        res.render('admin/users/role', {user})
    }

    static async updateRolePOST (req: Request, res: Response) {
        const body = req.body
        const params = req.params

        return User.updateRole(res, body, params)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async listingCharacters (req: Request, res: Response): Promise<void> {
        const results = await (new CharacterModel()).findAllWithCategory()

        const pagination = new Pagination()
        const paginateData = await pagination.paginate(req, results, CharacterModel)
        res.render('admin/characters/index', {
            characters: paginateData,
            moment,
            message: req.flash('success'),
            pages: paginate.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
            currentPage: pagination.currentPage ? pagination.currentPage : 1
        })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async listingCategories (req: Request, res: Response): Promise<void> {
        const results = await (new CategoryModel()).fetchAll()

        const pagination = new Pagination()
        const paginateData = await pagination.paginate(req, results, CharacterModel)
        res.render('admin/categories/index', {
            categories: paginateData,
            moment,
            pages: paginate.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
            currentPage: pagination.currentPage ? pagination.currentPage : 1
        })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     *
     * @return Promise<void>
     */
    static async listingUsers(req: Request, res: Response): Promise<void> {
        const results = await (new UserModel()).fetchAll()

        const pagination = new Pagination()
        const paginationData = await pagination.paginate(req, results, UserModel)
        res.render('admin/users/index', {
            users: paginationData,
            moment,
            pages: paginate.getArrayPages(req)(100, pagination.pageCount, pagination.currentPage),
            currentPage: pagination.currentPage ? pagination.currentPage : 1
        })
    }
}