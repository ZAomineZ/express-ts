import {Request, Response} from "express";
import {Comment} from "../middlewares/Comment";

export class CommentController {

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static comment (req: Request, res: Response) {
        return Comment.create(res, req)
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static reply (req: Request, res: Response) {
        return Comment.reply(res, req)
    }
}