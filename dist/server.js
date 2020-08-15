"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_paginate_1 = __importDefault(require("express-paginate"));
// Modules Middlewares and Controllers
const FileStorage_1 = require("./Storage/FileStorage");
const CharacterController_1 = require("./Controllers/CharacterController");
const CategoryController_1 = require("./Controllers/CategoryController");
const UserController_1 = require("./Controllers/UserController");
class Server {
    constructor(port) {
        this.port = 8080;
        this.directory = '/views';
        this.port = port;
    }
    start() {
        let $this = this;
        // Use EJS Template
        const app = express_1.default();
        Server.useTemplateEjs(app);
        // Generate Links CSS
        app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '..', 'assets')));
        // Middlewares
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json());
        app.use(express_session_1.default({
            secret: 'session-api',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
        }));
        app.use(connect_flash_1.default());
        app.use(express_paginate_1.default.middleware(10, 50));
        // Middlewares Request
        // GET ROUTES
        // ROUTES CHARACTERS
        app.get('/', CharacterController_1.CharacterController.index);
        app.get('/character/show/:id', CharacterController_1.CharacterController.show);
        // ROUTES CATEGORIES
        app.get('/category', CategoryController_1.CategoryController.index);
        app.get('/category/show/:id', CategoryController_1.CategoryController.show);
        // ROUTES ADMIN
        app.get('/admin/register', UserController_1.UserController.register);
        app.get('/admin/login', UserController_1.UserController.login);
        app.get('/admin', UserController_1.UserController.admin);
        app.get('/admin/characters', UserController_1.UserController.listingCharacters);
        app.get('/admin/categories', UserController_1.UserController.listingCategories);
        app.get('/admin/character/create', CharacterController_1.CharacterController.create);
        app.get('/admin/category/create', CategoryController_1.CategoryController.create);
        app.get('/admin/character/update/:id', CharacterController_1.CharacterController.edit);
        app.get('/admin/category/update/:id', CategoryController_1.CategoryController.edit);
        app.get('/admin/character/delete/:id', CharacterController_1.CharacterController.delete);
        // POST Routes
        // ROUTES CHARACTERS
        let upload = FileStorage_1.FileStorage.upload('characters/');
        app.post('/admin/character/create', upload.single('image'), CharacterController_1.CharacterController.createPOST);
        app.post('/admin/character/update/:id', CharacterController_1.CharacterController.update);
        // ROUTES CATEGORIES
        let uploadCategories = FileStorage_1.FileStorage.upload('category/');
        app.post('/admin/category/create', uploadCategories.single('image'), CategoryController_1.CategoryController.createPOST);
        app.post('/admin/category/update/:id', uploadCategories.single('image'), CategoryController_1.CategoryController.update);
        // ROUTES ADMIN
        app.post('/admin/register', UserController_1.UserController.registerPOST);
        app.post('/admin/login', UserController_1.UserController.loginPOST);
        app.listen(this.port, function () {
            console.log('Le serveur a démarré avec succès');
        });
    }
    static useTemplateEjs(app) {
        app.set('view engine', 'ejs');
    }
}
exports.default = Server;
