import {Request, Response} from "express";

export class Auth {

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {any} next
     */
    static checkSessionAuth(req: Request, res: Response, next: any) {
        if (req.cookies.user_sid && req.session && !req.session.user) {
            res.clearCookie('user_sid')
        }
        next()
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {any} next
     */
    static checkConnected(req: Request, res: Response, next: any) {
        if (req.cookies.user_sid && req.session && req.session.user) {
            res.redirect('/admin')
        } else {
            next()
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {any} next
     */
    static checkRoleAdmin(req: Request, res: Response, next: any) {
        let user = Auth.getAuth(req)
        // @ts-ignore
        if (user && user.role !== 1) {
            req.flash('danger', "Vous n'êtes pas autorizé autorisé à accéder à cette page !")
            res.redirect('/')
        } else {
            next()
        }
    }

    /**
     * @param {Request} req
     *
     * @return {Object|number}
     */
    static getAuth(req: Request): Object|null {
        return req.session ? req.session.user : null
    }
}