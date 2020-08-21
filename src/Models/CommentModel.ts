import {DB} from "../DB";

export class CommentModel {

    /**
     * @param {number} characterID
     */
    async findByCharacter(characterID: number) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT comments.id, comments.content, comments.reply_id, comments.created_at as dateComment, users.username as nameUser FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.character_id = ?';
            DB.connect().query(query, [characterID], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {number|null} userID
     */
    async findLastComment(userID?: number|null) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT comments.id, comments.content, comments.reply_id, comments.created_at as dateComment, users.username as nameUser FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.user_id = ? ORDER BY id DESC LIMIT 1';
            DB.connect().query(query, [userID], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @param {object[]} comments
     *
     * @return {any[]}
     */
    commentsWithReply(comments: object[]): any[] {
        let data: any[];
        data = [];

        comments.forEach((comment) => {
            // @ts-ignore
            data[comment.id] = comment
        })

        let newData: any[]
        let idComment: number[]

        newData = []
        idComment = []
        data.forEach((comment, key) => {
            // @ts-ignore
            if (comment.reply_id) {
                if (comment.reply_id !== 0) {
                    // @ts-ignore
                    if (!idComment.includes(comment.reply_id)) {
                        newData[comment.reply_id] = {...data[comment.reply_id], reply: []}
                        idComment.push(comment.reply_id)
                    }
                    newData[comment.reply_id]['reply'].push(data[comment.id])
                }
            } else {
                newData[comment.id] = comment
            }
        })
        console.log(newData)
        return newData
    }
}