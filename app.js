const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');

const path = require('./util/path');
const errorController = require('./controllers/error');
const dbContext = require('./util/db-context');

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

app.use((req, res, next) => {
    User.findByPk(adminUserId)
        .then(user => {
            req.user = user;
            //console.log(user);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRouters);
app.use(shopRouters);

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
// Cart
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// Order
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


const adminUserId = 1;

dbContext
    //.sync({ force: true })
    .sync()
    .then(() => {
        return User.findByPk(adminUserId);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Orifjon', email: 'info@orifjon.net' });
        }
        return user
    })
    .then(user => {
        user.createCart();
    })
    .then(() => {
        app.listen(3000, () => {
            console.log('http://localhost:3000 started');
        })
    })
    .catch(err => console.log(err));


