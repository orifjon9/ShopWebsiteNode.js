const express = require('express');

const router = express.Router();

const products = ['Banana', 'apple'];


router.get('/products', (req, res, next) => {
    const usersHtml = products.map(prod => `<li>${prod}</li>`).join('');
    res.send(`<html><headers><title>Products page</title></headers><body><h1>List of products</h1><ul>${usersHtml}</ul></body></html>`);
});

router.get('/products/add', (req, res, next) => {
    res.send('<html><header><title>Add Product</title></header><body><form method="POST" action="/products"><input name="title" type="text"/><button type="submit">Save</button></form></body></html>')
});

router.post('/products', (req, res, next) => {
    products.push(req.body.title);
    res.redirect('/products');
});

module.exports = router;