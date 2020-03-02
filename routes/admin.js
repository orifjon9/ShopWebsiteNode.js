const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


router.get('/products/add', adminController.getAddProduct);
router.get('/products', adminController.getProducts);

router.post('/products', adminController.addProduct);

module.exports = router;