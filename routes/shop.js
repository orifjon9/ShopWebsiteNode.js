const express = require('express');
const path = require('../util/path');

const products = require('../data/products');
const router = express.Router();


router.get('/products', (req, res, next) => {
    const usersHtml = products.map(prod => `<li>${prod.title}</li>`).join('');
    res.send(`<html><headers><title>Products page</title></headers><body><h1>List of products</h1><ul>${usersHtml}</ul></body></html>`);
});

router.get('/', (req, res, next) => {
    res.sendFile(path('views', 'shop.html'));
});

module.exports = router;