import {Request, Response} from "express";
import {DB} from "../DB";
import {Auth} from "./Auth";
import {Query} from "mysql";

export class Comment {

    /**
     * @param {Response} res
     * @param {Request} req
     *
     * @return Query|void
     */
    static create (res: Response, req: Request): Query|void {
        const body = req.body
        const params = req.params

        // @ts-ignore
        let userID = Auth.getAuth(req) ? Auth.getAuth(req).id : null
        if (!userID) {
            req.flash('danger', 'Vous devez vous connecter afin poursuivre cette action !!!')
            return res.redirect('/character/show/' + params.id)
        }
        let data = [body.content, userID, params.id, new Date()]
        return DB.connect().query('INSERT INTO comments SET content = ?, user_id = ?, character_id = ?, created_at = ?', data, function (error) {
            if (error) throw error
            if (!error) {
                req.flash('success', 'Vous avez ajouté votre commentaire !!!')
                res.redirect('/character/show/' + params.id)
            }
        })
    }

}