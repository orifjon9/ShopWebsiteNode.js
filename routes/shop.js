const express = require('express');
const path = require('../util/path');

const shopController = require('../controllers/shop');
const router = express.Router();


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;

// more about Pug
// https://pugjs.org/api/getting-started.html