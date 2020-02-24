const express = require('express');
const path = require('../util/path');

const products = require('../data/products');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('shop', { 
        prods: products, 
        pageTitle: 'Shop',
        hasProducts: products.length > 0 
    });
});

module.exports = router;

// more about Pug
// https://pugjs.org/api/getting-started.html