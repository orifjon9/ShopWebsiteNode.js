const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


router.get('/products/add', adminController.getAddProduct);
router.get('/products/:productId/edit', adminController.getEditProduct);
router.get('/products', adminController.getProducts);

router.post('/products', adminController.postProduct);
router.put('/products/:productId', adminController.putProduct);

module.exports = router;