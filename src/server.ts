import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import routes from './routes/routes'
import UserModel from './models/usuarios'
import validatePass from './utils/passValidator'
import  createHash  from './utils/hashGenerator'
import passport from 'passport';
import * as passportLocal from 'passport-local';
import path from 'path'
//import { trusted } from 'mongoose';

const LocalStrategy = passportLocal.Strategy;

const TIEMPO_EXPIRACION = 30000;

const app = express();

app.use(session({
secret: 'coderhouse',
cookie: {
    httpOnly:false,
    secure:false,
    maxAge: TIEMPO_EXPIRACION
},
rolling:true,
resave:true,
saveUninitialized:true

}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());



app.engine('hbs', handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/src/views/layouts/",
        //layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: __dirname + "/src/views/partials/",
        //partialsDir: path.join(app.get('views'), 'partials') ,
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    })
);

app.set('view engine', 'hbs');
app.set('views', './views');


//app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + "/public"));


passport.use('login', new LocalStrategy(
    (username, password, callback) => {
        UserModel.findOne({ username: username }, (err: any, user: any) => {
            if (err) {
                return callback(err)
            }

            if (!user) {
                console.log('No se encontro usuario');
                return callback(null, false)
            }

            if(!validatePass(user, password)) {
                console.log('Invalid Password');
                return callback(null, false)
            }

            return callback(null, user)
        })
    }
))

passport.use('signup', new LocalStrategy(
    {passReqToCallback: true}, (req, username, password, callback) => {
        UserModel.findOne({ username: username }, (err: any, user: any) => {
            if (err) {
                console.log('Hay un error al registrarse');
                return callback(err)
            }

            if (user) {
                console.log('El usuario ya existe');
                return callback(null, false)
            }

            console.log(req.body);

            const newUser = {
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                username: username,
                password: createHash(password)
            }

            console.log(newUser);


            UserModel.create(newUser, (err, userWithId) => {
                if (err) {
                    console.log('Hay un error al registrarse');
                    return callback(err)
                }

                console.log(userWithId);
                console.log('Registro de usuario satisfactoria');

                return callback(null, userWithId)
            })
        })
    }
))


passport.serializeUser((user, callback) => {
    callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
    UserModel.findById(id, callback)
})


//  INDEX
app.get('/', routes.getRoot);

//  LOGIN
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), routes.postLogin);
app.get('/faillogin', routes.getFaillogin);

//  SIGNUP
app.get('/signup', routes.getSignup);
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), routes.postSignup);
app.get('/failsignup', routes.getFailsignup);

//  LOGOUT
app.get('/logout', routes.getLogout);


// PROFILE
app.get('/profile', routes.getProfile);

app.get('/ruta-protegida', routes.checkAuthentication, (req, res) => {
    res.render('protected')
});

//  FAIL ROUTE
app.get('*', routes.failRoute);

const server = app.listen(8080, () => {
    console.log('Server on port 8080');
})


server.on('error', error => console.log(`Error en el servidor ${error}`))