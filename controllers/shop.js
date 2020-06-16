const fs = require('fs');

const path = require('../util/path');

const Product = require('../models/mongodb/product');
const Order = require('../models/mongodb/order');
const User = require('../models/mongodb/user');
const stripe = require('stripe')('stripe private key');

const ITEMS_PER_PAGE = 10;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.countDocuments()
        .then(numbers => {
            totalItems = numbers;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/products/list', {
                prods: products,
                pageTitle: 'Shop products',
                path: 'shop-products',
                totalItems: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        });
};

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.countDocuments()
        .then(numbers => {
            totalItems = numbers;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop',
                totalItems: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
    User.findById(req.session.user._id)
        .then(user => {
            user
                .populate('cart.items.productId')
                .execPopulate()
                .then(user => {
                    res.render('shop/cart', {
                        pageTitle: 'Your Cart',
                        path: 'cart',
                        items: user.cart.items
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
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.createOrder = (req, res, next) => {
    let fetchedUser;

    User.findById(req.session.user._id)
        .then(user => {
            fetchedUser = user;
            var products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: i.productId
                };
            });

            return Order.create({
                products: products,
                user: {
                    name: req.session.user.username,
                    id: req.session.user._id
                }
            })
                .then(() => fetchedUser.clearCart())
                .then(() => {
                    res.redirect('/orders');
                })
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    let items;
    let totalSum;
    User.findById(req.session.user._id)
        .then(user => {
            user
                .populate('cart.items.productId')
                .execPopulate()
                .then(user => {
                    items = user.cart.items;
                    totalSum = user.cart.items.map(i => i.quantity * i.productId.price).reduce((a, b) => a + b, 0);

                    return stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: items.map(i => {
                            return {
                                name: i.productId.title,
                                description: i.productId.description,
                                amount: i.productId.price * 100,
                                currency: 'usd',
                                quantity: i.quantity
                            }
                        }),
                        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
                    });
                })
                .then(session => {
                    res.render('shop/checkout', {
                        pageTitle: 'Checkout',
                        path: 'checkout',
                        items: items,
                        totalSum: totalSum,
                        sessionId: sessionId
                    });
                })
        })
        .catch(err => console.log(err));
};

exports.getCheckoutSuccess = (req, res, next) => {
    let fetchedUser;

    User.findById(req.session.user._id)
        .then(user => {
            fetchedUser = user;
            var products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: i.productId
                };
            });

            return Order.create({
                products: products,
                user: {
                    name: req.session.user.username,
                    id: req.session.user._id
                }
            })
                .then(() => fetchedUser.clearCart())
                .then(() => {
                    res.redirect('/orders');
                })
        })
        .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const filename = `invoice-${orderId}.pdf`;
    const invoicePath = path('data', 'invoices', filename);

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return res.redirect('/404');
            } else if (order && order.user.id.toString() === req.session.user._id.toString()) {
                // Not good practice 
                // fs.readFile(invoicePath, (err, data) => {
                //     if (!data) {
                //         res.redirect('/500');
                //     } else {
                //         res.setHeader('Content-Type', 'application/pdf');
                //         res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                //         res.send(data);
                //     }
                // });
                // streaming data on the fly instead of collect in the memory
                const file = fs.createReadStream(invoicePath);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
                file.pipe(res);

            } else {
                return res.redirect('/500');
            }
        })


};

