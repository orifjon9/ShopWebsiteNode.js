const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/products/add', { pageTitle: 'Add Product', path: 'add-product' })
};

exports.addProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, price, description);
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