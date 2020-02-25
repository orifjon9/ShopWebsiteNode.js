const express = require('express');
const path = require('../util/path');

const products = require('../data/products');
const router = express.Router();


router.get('/products/add', (req, res, next) => {
    res.render('products/add', {pageTitle: 'Add Product', path:'add-product'})
});

router.post('/products', (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

module.exports = router;