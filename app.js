const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

dotenv.config();

const path = require('./util/path');
const errorController = require('./controllers/error');
//const { connect, adminUserId, User } = require('./models/sequelize/index');

const { mongoDBConnect, sessionStore } = require('./util/mongoDB');
const User = require('./models/mongodb/user');

const app = express();

// set template engine
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
// by default, it is 'views'. You can change if you want
//app.set('views', 'views');


const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');
const authRouters = require('./routes/auth');

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname}-${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const accessLogStream = fs.createWriteStream(
    path('access.log'),
    { flags: 'a' }
)

// Deploying App
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
///

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path('public')));
app.use('/images', express.static(path('images')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore(process.env.MONGODB_URI)
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRouters);
app.use(shopRouters);
app.use(authRouters);

app.use('/500', (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error Page',
        path: '500'
    })
});

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page was not found',
        path: '404'
    })
});

// connect()
//     .then(() => {
//         app.listen(3000, () => {
//             console.log('http://localhost:3000 started');
//         })
//     })
//     .catch(err => console.log(err));

mongoDBConnect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`http://localhost:${process.env.PORT} started`);
        });
    })
    .catch(err => console.log(err));

