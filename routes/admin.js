const express = require('express');
const path = require('../util/path');

const products = require('../data/products');
const router = express.Router();


router.get('/products/add', (req, res, next) => {
    res.sendFile(path('views', 'products', 'add.html'));
});

router.post('/products', (req, res, next) => {
    products.push(req.body.title);
    res.redirect('/products');
});

module.exports = router;