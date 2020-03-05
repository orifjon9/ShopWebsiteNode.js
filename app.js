const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');

const path = require('./util/path');
const errorController = require('./controllers/error');

const app = express();

// set template engine
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
// by default, it is 'views'. You can change if you want
//app.set('views', 'views');


const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path('public')));

app.use('/admin', adminRouters);
app.use(shopRouters);

//app.use(errorController.get404)

app.listen(3000, () => {
    console.log('http://localhost:3000 started');
})