const Product = require('../models/mongodb/product');
const Order = require('../models/mongodb/order');
const User = require('../models/mongodb/user');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products/list', {
                prods: products,
                pageTitle: 'Shop products',
                path: 'shop-products',
                isAuthenticated: req.session.isLoggedIn
            });
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop',
                isAuthenticated: req.session.isLoggedIn
            });
        });
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then(product => {
            res.render('shop/products/details', {
                product: product,
                pageTitle: `${product.title} | Product`,
                path: 'product-details',
                isAuthenticated: req.session.isLoggedIn
            });
        }).catch(err => {
            res.redirect('/404');
        });
}

exports.getCart = (req, res, next) => {
    User.findById(req.session.user._id)
        .then(user => {
            user
                .populate('cart.items.productId')
                .execPopulate()
                .then(user => {
                    console.log(user.cart.items);
                    res.render('shop/cart', {
                        pageTitle: 'Your Cart',
                        path: 'cart',
                        items: user.cart.items,
                        isAuthenticated: req.session.isLoggedIn
                    });
                })
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    User.findById(req.session.user._id)
        .then(user => {
            return user.addProductToCart(productId);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.deleteCart = (req, res, next) => {
    const productId = req.params.productId;

    User.findById(req.session.user._id)
        .then(user => {
            return user.deleteItemFromCart(productId);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.id': req.session.user._id })
        .populate('products.product')
        .then(orders => {
            return res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: 'orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.createOrder = (req, res, next) => {

    var products = req.session.user.cart.items.map(i => {
        return {
            quantity: i.quantity,
            product: i.productId
        };
    })

    Order.create({
        products: products,
        user: {
            name: req.session.user.username,
            id: req.session.user._id
        }
    })
        .then(() => {
            return User.findById(req.session.user._id);
        })
        .then(user => user.clearCart())
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout',
        isAuthenticated: req.session.isLoggedIn
    });
};

