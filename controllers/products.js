const products = require('../data/products');

exports.getAddProduct = (req, res, next) => {
    res.render('products/add', { pageTitle: 'Add Product', path: 'add-product' })
};

exports.addProduct = (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        hasProducts: products.length > 0,
        path: 'shop'
    });
};