
const Product = require('../product');
const User = require('..//user');
const Cart = require('../cart');
const CartItem = require('../cart-item');
const Order = require('../order');
const OrderItem = require('../order-item');

const dbContext = require('../../util/db-context');

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

const connect = () => {
    return new Promise((resolve, reject) => {
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
                resolve(true)
            })
            .catch(err => reject(err));
    });
};

module.exports = {
    Product,
    User,
    Cart,
    CartItem,
    Order,
    OrderItem,
    connect,
    adminUserId
}