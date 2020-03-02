const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/products/add', { pageTitle: 'Add Product', path: 'add-product' })
};

exports.addProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();

    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products/list', {
            prods: products,
            pageTitle: 'Admin Products',
            path: 'admin-products'
        });
    });
};