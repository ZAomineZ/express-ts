import {Express} from "express"
import express from 'express'
import bodyParser from 'body-parser'
import path from "path";
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'connect-flash'
import paginate from 'express-paginate'

// Modules Middlewares and Controllers
import {FileStorage} from "./Storage/FileStorage";
import {CharacterController} from "./Controllers/CharacterController";
import {CategoryController} from "./Controllers/CategoryController";
import {UserController} from "./Controllers/UserController";
import {Auth} from "./middlewares/Auth";

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
        app.use(session({
            secret: 'somerandonstuffs',
            key: 'user_sid',
            resave: false,
            saveUninitialized: true,
            cookie: {
                // @ts-ignore
                expires: 600000
            }
        }))
        app.use(flash())
        app.use(paginate.middleware(10, 50));
        app.use(cookieParser())

        // Middlewares Cookies and Sessions
        app.use(Auth.checkSessionAuth)

        // Middlewares Request

        // GET ROUTES
        // ROUTES CHARACTERS
        app.get('/', CharacterController.index);
        app.get('/character/show/:id', CharacterController.show);

        // ROUTES CATEGORIES
        app.get('/category', CategoryController.index);
        app.get('/category/show/:id', CategoryController.show);

        // ROUTES ADMIN
        app.get('/admin/register', Auth.checkConnected, UserController.register);
        app.get('/admin/login', Auth.checkConnected, UserController.login)
        app.get('/admin/logout', UserController.logout)

        app.get('/admin', UserController.admin)
        app.get('/admin/characters', UserController.listingCharacters)
        app.get('/admin/categories', UserController.listingCategories);
        app.get('/admin/character/create', CharacterController.create);
        app.get('/admin/category/create', CategoryController.create);
        app.get('/admin/character/update/:id', CharacterController.edit);
        app.get('/admin/category/update/:id', CategoryController.edit)
        app.get('/admin/character/delete/:id', CharacterController.delete);

        // POST Routes
        // ROUTES CHARACTERS
        let upload = FileStorage.upload('characters/')
        app.post('/admin/character/create', upload.single('image'), CharacterController.createPOST);
        app.post('/admin/character/update/:id', CharacterController.update);

        // ROUTES CATEGORIES
        let uploadCategories = FileStorage.upload('category/')
        app.post('/admin/category/create', uploadCategories.single('image'), CategoryController.createPOST);
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
