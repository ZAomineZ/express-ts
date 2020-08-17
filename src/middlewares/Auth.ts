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
        console.log(req.cookies.user_sid)
        if (req.cookies.user_sid && req.session && req.session.user) {
            res.redirect('/admin')
        } else {
            next()
        }
    }
}