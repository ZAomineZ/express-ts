import {Express} from "express"
import express from 'express'
import bodyParser from 'body-parser'
import path from "path";
import session from 'express-session'

// Modules Middlewares and Controllers
import {FileStorage} from "./Storage/FileStorage";
import {CharacterController} from "./Controllers/CharacterController";
import {CategoryController} from "./Controllers/CategoryController";
import {UserController} from "./Controllers/UserController";

export default class Server {
    readonly port: number = 8080;
    public directory : string = '/views';

    constructor(port: number) {
        this.port = port
    }

    start() {
        let $this = this;

        // Use EJS Template
        const app = express();
        Server.useTemplateEjs(app);

        // Generate Links CSS
        app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

        // Middlewares
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(session({secret: 'auth-user', saveUninitialized: true, resave: true}))

        // Middlewares Request

        // GET ROUTES
        // ROUTES CHARACTERS
        app.get('/', CharacterController.index);
        app.get('/character/create', CharacterController.create);
        app.get('/character/show/:id', CharacterController.show);

        // ROUTES CATEGORIES
        app.get('/category', CategoryController.index);
        app.get('/category/create', CategoryController.create);
        app.get('/category/show/:id', CategoryController.show);

        // ROUTES ADMIN
        app.get('/admin/register', UserController.register);
        app.get('/admin/login', UserController.login)
        app.get('/admin', UserController.admin)
        app.get('/admin/characters', UserController.listingCharacters)
        app.get('/admin/categories', UserController.listingCategories);
        app.get('/admin/character/update/:id', CharacterController.edit);
        app.get('/admin/category/update/:id', CategoryController.edit)

        // POST Routes
        // ROUTES CHARACTERS
        let upload = FileStorage.upload('characters/')
        app.post('/character/create', upload.single('image'), CharacterController.createPOST);
        app.post('/admin/character/update/:id', CharacterController.update);

        // ROUTES CATEGORIES
        let uploadCategories = FileStorage.upload('category/')
        app.post('/category/create', uploadCategories.single('image'), CategoryController.createPOST);
        app.post('/admin/category/update/:id', uploadCategories.single('image'), CategoryController.update)

        // ROUTES ADMIN
        app.post('/admin/register', UserController.registerPOST)
        app.post('/admin/login', UserController.loginPOST)

        app.listen(this.port, function () {
            console.log('Le serveur a démarré avec succès')
        })
    }

    static useTemplateEjs(app: Express): void {
        app.set('view engine', 'ejs');
    }
}
