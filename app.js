const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const csrf = require('csurf');

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path('public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRouters);
app.use(shopRouters);
app.use(authRouters);


// connect()
//     .then(() => {
//         app.listen(3000, () => {
//             console.log('http://localhost:3000 started');
//         })
//     })
//     .catch(err => console.log(err));

mongoDBConnect()
    .then(() => {
        app.listen(3000, () => {
            console.log('http://localhost:3000 started');
        });
    })
    .catch(err => console.log(err));


