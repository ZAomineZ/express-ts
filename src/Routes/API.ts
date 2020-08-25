import {Express} from "express";
import {CharacterControllerAPI} from "../Controllers/API/CharacterControllerAPI";

export class API {

    /**
     * ROUTES API CHARACTERS
     *
     * @param {Express} app
     */
    static charactersAPI(app: Express) {
        app.get('/api/characters', CharacterControllerAPI.characters)
        app.get('/api/characters/:name', CharacterControllerAPI.character)
        app.get('/api/characters/category/:name', CharacterControllerAPI.charactersByCategory)
        app.get('/api/characters/age/:age', CharacterControllerAPI.byAge)
        app.get('/api/characters/sexe/:type', CharacterControllerAPI.bySexe)
        app.get('/api/characters/size/:size', CharacterControllerAPI.bySize)
        app.get('/api/characters/order/:typeOrder', CharacterControllerAPI.recent)
    }

    /**
     * ROUTES API CATEGORIES
     *
     * @param {Express} app
     */
    static categoriesAPI(app: Express) {
    }

}