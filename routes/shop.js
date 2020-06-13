const express = require('express');
const path = require('../util/path');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.delete('/cart/:productId', isAuth, shopController.deleteCart);

router.get('/orders', isAuth, shopController.getOrders);
router.post('/orders', isAuth, shopController.createOrder);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/invoices/:orderId', shopController.getInvoice)

module.exports = router;

// more about Pug
// https://pugjs.org/api/getting-started.html