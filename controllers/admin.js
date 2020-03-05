const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products/list', {
            prods: products,
            pageTitle: 'Admin Products',
            path: 'admin-products'
        });
    });
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/products/add', { pageTitle: 'Add Product', path: 'add-product' })
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    if (productId) {
        Product.getById(productId, product => {
            if (product) {
                res.render('admin/products/edit', {
                    pageTitle: 'Update Product',
                    path: 'add-product',
                    product: product
                });
            } else {
                redirectToPageNotFound(res);
            }
        });
    } else {
        redirectToPageNotFound(res);
    }
};

exports.postProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, price, description);
    product.save();

    res.redirect('/');
};

exports.putProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    let product = new Product(title, imageUrl, price, description);
    product.id = +req.params.productId;

    product.update();
};

const redirectToPageNotFound = (res) => res.redirect('/404');