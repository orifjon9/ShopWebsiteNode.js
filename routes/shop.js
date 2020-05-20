const express = require('express');
const path = require('../util/path');

const shopController = require('../controllers/shop');
const router = express.Router();


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.delete('/cart/:productId', shopController.deleteCart);

router.get('/orders', shopController.getOrders);
router.post('/orders', shopController.createOrder);
router.get('/checkout', shopController.getCheckout);

module.exports = router;

// more about Pug
// https://pugjs.org/api/getting-started.html