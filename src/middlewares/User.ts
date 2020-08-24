import {Request, Response} from "express";
import {DB} from "../DB";
import {Password} from "../Helpers/Password";
import {Query} from "mysql";
import {UserModel} from "../Models/UserModel";
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export class User {
    static password: Password = new Password;
    static accessTokenSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    /**
     * @param {any} response
     * @param {Response} res
     *
     * @return Promise<void | Query>
     */
    static async register(response: any, res: Response): Promise<void | Query> {
        // Verify if the password and password confirmation are equal else redirect register page
        if (!this.password.passwordIdem(response.password, response.password_confirmation)) {
            return res.redirect('/admin/register')
        }

        const password = await this.password.generatePassword(response.password)
        const data = [response.username, response.email, password]
        return DB.connect().query('INSERT INTO users SET username = ?, email = ?, password = ?', data, function (error, results) {
            if (error) throw error
            if (!error) {
                res.redirect('/admin/login')
            }
        })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    static async forget(req: Request, res: Response) {
        let email = req.body.email
        let password = req.body.new_password
        let passwordConfirmation = req.body.new_password_confirmation

        const user = await (new UserModel()).findByEmail(email)
        if (!user) {
            req.flash('danger', 'Cet email n\'est pas éxistant dans notre base de donnée !')
            return res.redirect('/admin/forget')
        }
        if (!this.password.passwordIdem(password, passwordConfirmation)) {
            req.flash('danger', 'Les mot de passes ne sont pas identiques !')
            return res.redirect('/admin/forget')
        }

        password = await this.password.generatePassword(password)
        const data = [password, email]
        return DB.connect().query('UPDATE users SET password = ? WHERE email = ?', data, function (error) {
            if (error) throw error
            if (!error) {
                req.flash('success', 'Vous avez modifié votre mot de passe avec succès !')
                res.redirect('/admin/login')
            }
        })
    }

    /**
     * @param {any} response
     * @param {Response} res
     * @param {any} sessionReq
     */
    static async login(response: any, res: Response, sessionReq: any): Promise<void> {
        let user = await (new UserModel()).findByName(response.username)
        if (!user) {
            return res.redirect('/admin/login')
        }

        // If user exist
        let result = await bcrypt.compare(response.password, user.password)
        if (!result) {
            return res.redirect('/admin/login')
        }

        // Set Session User
        jsonwebtoken.sign({username: user.username}, this.accessTokenSecret)
        sessionReq.user = user
        res.end()
        return res.redirect('/admin')
    }

    /**
     * @param {Response} response
     * @param {Request} request
     */
    static async delete(response: Response, request: Request) {
        const params = request.params

        let user = await (new UserModel()).findByID(parseInt(params.id))
        if (!user) {
            return response.redirect('/admin/users')
        }

        return DB.connect().query('DELETE FROM users WHERE id = ?', [params.id], function (error) {
            if (error) throw error
            if (!error) {
                request.flash('success', `Vous avez supprimé ${user.username} avec succès !`)
                response.redirect('/admin/users')
            }
        })
    }

    /**
     *
     * @param {Response} res
     * @param {any} body
     * @param {any} params
     */
    static async updateRole(res: Response, body: any, params: any) {
        const role = body.role ? parseInt(body.role) : 0
        const id = params.id ? parseInt(params.id) : null

        DB.connect().query('UPDATE users SET role = ? WHERE id = ?', [role, id], function (error) {
            if (error) throw error
            if (!error) {
                res.redirect('/admin/users')
            }
        })
    }
}