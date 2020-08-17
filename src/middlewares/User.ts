import {Response} from "express";
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
}