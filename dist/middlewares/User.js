"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const DB_1 = require("../DB");
const Password_1 = require("../Helpers/Password");
const UserModel_1 = require("../Models/UserModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    /**
     * @param {any} response
     * @param {Response} res
     *
     * @return Promise<void | Query>
     */
    static register(response, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify if the password and password confirmation are equal else redirect register page
            if (!this.password.passwordIdem(response.password, response.password_confirmation)) {
                return res.redirect('/admin/register');
            }
            const password = yield this.password.generatePassword(response.password);
            const data = [response.username, response.email, password];
            return DB_1.DB.connect().query('INSERT INTO users SET username = ?, email = ?, password = ?', data, function (error, results) {
                if (error)
                    throw error;
                if (!error) {
                    res.redirect('/admin/login');
                }
            });
        });
    }
    /**
     * @param {Request} req
     * @param {Response} res
     */
    static forget(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let password = req.body.new_password;
            let passwordConfirmation = req.body.new_password_confirmation;
            const user = yield (new UserModel_1.UserModel()).findByEmail(email);
            if (!user) {
                req.flash('danger', 'Cet email n\'est pas éxistant dans notre base de donnée !');
                return res.redirect('/admin/forget');
            }
            if (!this.password.passwordIdem(password, passwordConfirmation)) {
                req.flash('danger', 'Les mot de passes ne sont pas identiques !');
                return res.redirect('/admin/forget');
            }
            password = yield this.password.generatePassword(password);
            const data = [password, email];
            return DB_1.DB.connect().query('UPDATE users SET password = ? WHERE email = ?', data, function (error) {
                if (error)
                    throw error;
                if (!error) {
                    req.flash('success', 'Vous avez modifié votre mot de passe avec succès !');
                    res.redirect('/admin/login');
                }
            });
        });
    }
    /**
     * @param {any} response
     * @param {Response} res
     * @param {any} sessionReq
     */
    static login(response, res, sessionReq) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield (new UserModel_1.UserModel()).findByName(response.username);
            if (!user) {
                return res.redirect('/admin/login');
            }
            // If user exist
            let result = yield bcrypt_1.default.compare(response.password, user.password);
            if (!result) {
                return res.redirect('/admin/login');
            }
            // Set Session User
            jsonwebtoken_1.default.sign({ username: user.username }, this.accessTokenSecret);
            sessionReq.user = user;
            res.end();
            return res.redirect('/admin');
        });
    }
    /**
     * @param {Response} response
     * @param {Request} request
     */
    static delete(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = request.params;
            let user = yield (new UserModel_1.UserModel()).findByID(parseInt(params.id));
            if (!user) {
                return response.redirect('/admin/users');
            }
            return DB_1.DB.connect().query('DELETE FROM users WHERE id = ?', [params.id], function (error) {
                if (error)
                    throw error;
                if (!error) {
                    request.flash('success', `Vous avez supprimé ${user.username} avec succès !`);
                    response.redirect('/admin/users');
                }
            });
        });
    }
    /**
     *
     * @param {Response} res
     * @param {any} body
     * @param {any} params
     */
    static updateRole(res, body, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = body.role ? parseInt(body.role) : 0;
            const id = params.id ? parseInt(params.id) : null;
            DB_1.DB.connect().query('UPDATE users SET role = ? WHERE id = ?', [role, id], function (error) {
                if (error)
                    throw error;
                if (!error) {
                    res.redirect('/admin/users');
                }
            });
        });
    }
}
exports.User = User;
User.password = new Password_1.Password;
User.accessTokenSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
