const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('products/add', { pageTitle: 'Add Product', path: 'add-product' })
};

exports.addProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();

    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            hasProducts: products.length > 0,
            path: 'shop'
        });
    });
};