const { DataTypes, Sequelize } = require('sequelize');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
        Product.findByPk(productId)
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
    Product.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
    }).then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
};

exports.putProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const productId = +req.params.productId;

    Product.update({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
    }, { where: { id: productId } }
    ).then(() => {
        res.redirect(`/admin/products`);
    }).catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const id = +req.params.productId;
    Product.findByPk(id)
        .then(product => product.destroy())
        .then(() => {
            res.redirect(`/admin/products`);
        })
        .catch(err => console.log(err));
};

const redirectToPageNotFound = (res) => res.redirect('/404');