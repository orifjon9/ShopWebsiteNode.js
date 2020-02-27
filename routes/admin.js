const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();


router.get('/products/add', productsController.getAddProduct);

router.post('/products', productsController.addProduct);

module.exports = router;