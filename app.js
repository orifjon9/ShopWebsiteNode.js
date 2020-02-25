const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const path = require('./util/path');

const app = express();

// set template engine
//app.set('view engine', 'pug');

app.set('view engine', 'ejs');

// app.engine('hbs', expressHbs(
//     {
//         layoutsDir: 'views/layouts/', 
//         defaultLayout: 'main-layout',
//         extname: 'hbs'
//     }));
// app.set('view engine', 'hbs');

// by default, it is 'views'. You can change if you want
//app.set('views', 'views');


const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path('public')));

app.use('/admin', adminRouters);
app.use(shopRouters);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '' });
})

app.listen(3000, () => {
    console.log('http://localhost:3000 started');
})