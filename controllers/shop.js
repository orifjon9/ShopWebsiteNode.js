const Product = require('../models/mongodb/product');
const Order = require('../models/mongodb/order');
const User = require('../models/mongodb/user');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products/list', {
                prods: products,
                pageTitle: 'Shop products',
                path: 'shop-products'
            });
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop'
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
                path: 'product-details'
            });
        }).catch(err => {
            res.redirect('/404');
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user.cart.items);
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                items: user.cart.items
            });

        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    req.user
        .addProductToCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.deleteCart = (req, res, next) => {
    const productId = req.params.productId;

    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.id': req.user._id })
        .populate('products.product')
        .then(orders => {
            console.log(orders);
            return res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: 'orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.createOrder = (req, res, next) => {

    var products = req.user.cart.items.map(i => {
        return {
            quantity: i.quantity,
            product: i.productId
        };
    })

    Order.create({
        products: products,
        user: {
            name: req.user.username,
            id: req.user._id
        }
    })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    });
};

