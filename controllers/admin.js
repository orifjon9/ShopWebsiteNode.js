const Product = require('../models/mongodb/product');

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
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
        Product.getProductById(productId)
            .then(product => {
                res.render('admin/products/edit', {
                    pageTitle: 'Update Product',
                    path: 'add-product',
                    product: product
                });
            }).catch(err => {
                redirectToPageNotFound(res);
            });
    } else {
        redirectToPageNotFound(res);
    }
};

exports.postProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    new Product(
        title,
        description,
        price,
        imageUrl,
        null,
        req.user.id
    )
        .save()
        .then(() => {
            res.redirect('/');
        }).catch(err => console.log(err));
};

exports.putProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const productId = req.params.productId;

    new Product(
        title,
        description,
        price,
        imageUrl,
        productId,
        req.user.id
    )
        .save().then(() => {
            res.redirect(`/admin/products`);
        }).catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteById(id)
        .then(() => {
            res.redirect(`/admin/products`);
        })
        .catch(err => console.log(err));
};

const redirectToPageNotFound = (res) => res.redirect('/404');