import {Request, Response} from "express";
import {CharacterModel} from "../../Models/CharacterModel";
import {CategoryModel} from "../../Models/CategoryModel";
import {type} from "os";

export class CharacterControllerAPI {
    static characterModel: CharacterModel = new CharacterModel();
    static categoryModel: CategoryModel = new CategoryModel()

    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return Promise<Response>
     */
    static async characters(request: Request, response: Response): Promise<Response> {
        const characters = await CharacterControllerAPI.characterModel.findAll()
        return response.json({characters})
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    static async character(request: Request, response: Response) {
        const params = request.params
        const name = params.name

        const character = await CharacterControllerAPI.characterModel.findSearch(name)
        if (character.length !== 0) {
            return response.json({
                success: true,
                character
            })
        }
        return response.json({success: false, message: `Aucun personnages n'a était trouvés !`})
    }

    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return Promise<Response>
     */
    static async charactersByCategory(request: Request, response: Response): Promise<Response> {
        const params = request.params
        const name = params.name

        let category = await CharacterControllerAPI.categoryModel.findSearch(name)
        if (category.length !== 0) {
            let categoryID = parseInt(category[0].id)
            const characters = await CharacterControllerAPI.characterModel.findAllByCategory(categoryID)

            return response.json({
                success: true,
                characters
            })
        }
        return response.json({success: false, message: `Aucun personnages n'a était trouvés liés à cette catégorie !`})
    }

    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return Promise<Response>
     */
    static async byAge(request: Request, response: Response): Promise<Response> {
        const params = request.params
        const age = params.age

        let characters = await CharacterControllerAPI.characterModel.findByAge(age)
        if (characters.length !== 0) {
            return response.json({
                success: true,
                characters
            })
        }
        return response.json({success: false, message: `Aucun personnages n'a était trouvés liés à cet age !`})
    }

    /**
     * @param request
     * @param response
     *
     * @return Promise<Response>
     */
    static async bySexe(request: Request, response: Response): Promise<Response> {
        const params = request.params
        const type = params.type

        let characters = await CharacterControllerAPI.characterModel.findBySexe(type)
        if (characters.length !== 0) {
            return response.json({success: true, characters})
        }
        return response.json({success: false, message: `Aucuns personnages n'a était trouvés à ce sexe !`})
    }

    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return Promise<Response>
     */
    static async bySize(request: Request, response: Response): Promise<Response> {
        const params = request.params
        const size = params.size

        let characters = await CharacterControllerAPI.characterModel.findBySize(size)
        if (characters.length !== 0) {
            return response.json({success: true, characters})
        }
        return response.json({success: false, message: `Aucuns personnages n'a était trouvés à cette taille !`})
    }

    /**
     * @param {Request} request
     * @param {Response} response
     *
     * @return Promise<Response>
     */
    static async recent(request: Request, response: Response): Promise<Response> {
        const params = request.params
        const typeOrder = params.typeOrder.toUpperCase()
        if (typeOrder !== 'ASC' && typeOrder !== 'DESC') {
            return response.json({success: false, message: `Le paramètre 'typeOrder' doit être 'ASC' ou 'DESC' !`})
        }

        let characters = await CharacterControllerAPI.characterModel.findByOrder('created_at', typeOrder)
        if (characters.length !== 0) {
            return response.json({success: true, characters})
        }
        return response.json({success: false, message: `Aucuns personnages n'a était trouvés à cette taille !`})
    }
}