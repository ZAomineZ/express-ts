import {Request, Response} from "express";
import {DB} from "../DB";
import {Auth} from "./Auth";
import {Query} from "mysql";
import {CommentModel} from "../Models/CommentModel";
import {CommentHTML} from "../HTML/CommentHTML";

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

    /**
     * @param {Response} res
     * @param {Request} req
     */
    static reply (res: Response, req: Request) {
        const bodyJSON = Object.keys(req.body)
        const params = req.params
        const content = bodyJSON[0] ? bodyJSON[0]: null

        // @ts-ignore
        let userID = Auth.getAuth(req) ? Auth.getAuth(req).id : null
        if (!userID) {
            return res.json({
                success: false,
                message: 'Vous devez vous connecter afin poursuivre cette action !!!'
            })
        }
        let data = [content, userID, params.id, params.commentID, new Date()]
        return DB.connect().query('INSERT INTO comments SET content = ?, user_id = ?, character_id = ?, reply_id = ?, created_at = ?', data, async function (error) {
            if (error) throw error
            if (!error) {
                let lastComment = await (new CommentModel()).findLastComment(userID)
                lastComment = CommentHTML.commentReply(lastComment[0])
                res.json({
                    success: true,
                    lastComment
                })
            }
        })
    }
}