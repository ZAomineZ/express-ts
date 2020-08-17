import {DB} from "../DB";

export class CommentModel {

    /**
     * @param {number} characterID
     */
    async findByCharacter(characterID: number) {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT comments.content, comments.created_at as dateComment, users.username as nameUser FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.character_id = ?';
            DB.connect().query(query, [characterID], function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

}