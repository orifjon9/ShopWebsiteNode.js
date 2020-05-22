const { Product } = require('../models/sequelize/index');
const Cart = require('../models/cart-old');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/products/list', {
                prods: products,
                pageTitle: 'Shop products',
                path: 'shop-products'
            });
        });
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop'
            });
        });
};

exports.getProduct = (req, res, next) => {
    const id = +req.params.productId;
    Product.findByPk(id)
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
        .getCart()
        .then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'Your Cart',
                        path: 'cart',
                        products: products,
                        totalPrice: cart.totalPrice
                    });

                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = +req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            if (products.length > 0) {
                const product = products[0];
                newQuantity = product.cartItem.quantity + 1;
                return product;
            }
            else {
                return Product.findByPk(productId);
            }
        })
        .then(product => {
            return fetchedCart
                .addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.deleteCart = (req, res, next) => {
    const productId = +req.params.productId;

    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
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
    let fetchedProducts;
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            fetchedProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            order.addProducts(fetchedProducts.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }))
        })
        .then(() => {
            return fetchedCart.setProducts(null);
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

