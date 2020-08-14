import {DB} from "../DB";

export class CharacterModel {

    /**
     * @return Promise<void>
     */
    async findAll(): Promise<void> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT * FROM characters';
            DB.connect().query(query, function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }

    /**
     * @return Promise<void>
     */
    async findAllWithCategory(): Promise<void> {
        let promise = new Promise((resolve: any, reject: any) => {
            const query = 'SELECT characters.id, characters.name as characterName, category.name as categoryName, characters.content, characters.age, characters.size, characters.image, characters.created_at FROM characters LEFT JOIN category ON characters.category = category.id';
            DB.connect().query(query, function (error, results) {
                if (error) throw error;
                if (!error) {
                    resolve(results)
                }
            });
        });
        return promise.then((result: any) => result)
    }
}