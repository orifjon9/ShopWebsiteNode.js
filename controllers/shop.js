const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/products/list', {
            prods: products,
            pageTitle: 'Shop products',
            path: 'shop-products'
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: 'shop'
        });
    });
};

exports.getProduct = (req, res, next) => {
    const id = +req.params.productId;

    Product.getById(id, product => {
        if (product) {
            res.render('shop/products/details', {
                product: product,
                pageTitle: `${product.title} | Product`,
                path: 'product-details'
            });
        } else {
            res.redirect('/404');
        }
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            products.forEach(prod => {
                const cartProduct = cart.products.find(p => p.id === prod.id);
                if (cartProduct) {
                    cartProducts.push({ ...prod, quantity: cartProduct.quantity });
                }
            });

            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                products: cartProducts,
                totalPrice: cart.totalPrice
            });

        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = +req.body.productId;
    console.log(productId);
    Product.getById(productId, prod => {
        Cart.addProduct(productId, prod.price);
    });

    res.redirect('/cart');
};

exports.deleteCart = (req, res, next) => {
    const productId = +req.params.productId;
    console.log(productId);
    Product.getById(productId, product => {
        if (product) {
            console.log(product);
            Cart.deleteProduct(productId, product.price);
            res.redirect('/cart');
        }
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: 'orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    });
};

