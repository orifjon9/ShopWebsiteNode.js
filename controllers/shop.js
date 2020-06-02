const Product = require('../models/mongodb/product');
const Cart = require('../models/cart-old');

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
        .getCartProducts()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                products: products
            });

        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    // let fetchedCart;
    // let newQuantity = 1;

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
    req.user
        .getOrders()
        .then(orders => {
            return res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: 'orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.createOrder = (req, res, next) => {
    req.user
        .addOrder()
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

