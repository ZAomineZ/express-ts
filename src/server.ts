import {Express} from "express"
import engine from 'ejs-locals'
import express from 'express'
import bodyParser from 'body-parser'
import path from "path";
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'connect-flash'
import paginate from 'express-paginate'
import csrf from 'csurf'

// Modules Middlewares and Controllers
import {FileStorage} from "./Storage/FileStorage";
import {CharacterController} from "./Controllers/CharacterController";
import {CategoryController} from "./Controllers/CategoryController";
import {UserController} from "./Controllers/UserController";
import {Auth} from "./middlewares/Auth";
import {CommentController} from "./Controllers/CommentController";

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
        app.engine('ejs', engine)

        Server.useTemplateEjs(app);

        // Generate Links CSS AND JS
        app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
        app.use('/front', express.static(path.join(__dirname, '..', 'dist/Front')));

        // Middlewares
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json({ type: 'application/*+json' }))
        app.use(session({
            secret: 'somerandonstuffs',
            key: 'user_sid',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 600000
            }
        }))
        app.use(flash())
        app.use(paginate.middleware(10, 50));

        // COOKIE CSRF
        let csrfProtection = csrf()
        app.use(cookieParser())

        // Middlewares Cookies and Sessions
        app.use(Auth.checkSessionAuth)

        // Middlewares Request

        // GET ROUTES
        // ROUTES CHARACTERS
        app.get('/', CharacterController.index);
        app.get('/characters/search', CharacterController.search)
        app.get('/character/show/:id', CharacterController.show);

        // ROUTES CATEGORIES
        app.get('/category', CategoryController.index);
        app.get('/category/search', CategoryController.search)
        app.get('/category/show/:id', CategoryController.show);

        // ROUTES ADMIN
        app.get('/admin/register', Auth.checkConnected, UserController.register);
        app.get('/admin/forget', Auth.checkConnected, UserController.forget);
        app.get('/admin/login', Auth.checkConnected, UserController.login)
        app.get('/admin/logout', UserController.logout)

        app.get('/admin', Auth.checkRoleAdmin, UserController.admin)
        app.get('/admin/characters', Auth.checkRoleAdmin, UserController.listingCharacters)
        app.get('/admin/categories', Auth.checkRoleAdmin, UserController.listingCategories);
        app.get('/admin/users', Auth.checkRoleAdmin, UserController.listingUsers)

        app.get('/admin/character/create', Auth.checkRoleAdmin, CharacterController.create);
        app.get('/admin/category/create', Auth.checkRoleAdmin, CategoryController.create);

        app.get('/admin/character/update/:id', CharacterController.edit);
        app.get('/admin/category/update/:id', CategoryController.edit)
        app.get('/admin/character/delete/:id', csrfProtection, CharacterController.delete);
        app.get('/admin/user/role/:id', UserController.updateRole)
        app.get('/admin/user/delete/:id', csrfProtection, UserController.delete)

        // POST Routes
        // ROUTES CHARACTERS
        let upload = FileStorage.upload('characters/')
        app.post('/admin/character/create', upload.single('image'), CharacterController.createPOST);
        app.post('/admin/character/update/:id', upload.single('image'), CharacterController.update);

        // ROUTES CATEGORIES
        let uploadCategories = FileStorage.upload('category/')
        app.post('/admin/category/create', uploadCategories.single('image'), CategoryController.createPOST);
        app.post('/admin/category/update/:id', uploadCategories.single('image'), CategoryController.update)

        // ROUTES COMMENTS
        app.post('/character/show/:id', CommentController.comment)
        app.post('/api/character/show/:id/reply/:commentID', CommentController.reply)

        // ROUTES ROLES
        app.post('/admin/user/role/:id', UserController.updateRolePOST)

        // ROUTES ADMIN
        app.post('/admin/register', UserController.registerPOST)
        app.post('/admin/login', UserController.loginPOST)
        app.post('/admin/forget', UserController.forgetPOST)

        // ROUTES API FILTER
        app.post('/api/character/filter/:name', CharacterController.filter)
        app.post('/api/character/filterCategory/:id', CharacterController.filterCategory)

        app.listen(this.port, function () {
            console.log('Le serveur a démarré avec succès')
        })
    }

    static useTemplateEjs(app: Express): void {
        app.set('view engine', 'ejs');
    }
}