const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/products/add', isAuth, adminController.getAddProduct);
router.get('/products/:productId/edit', isAuth, adminController.getEditProduct);
router.get('/products', isAuth, adminController.getProducts);

router.post('/products', isAuth, adminController.postProduct);
router.put('/products/:productId', isAuth, adminController.putProduct);
router.delete('/products/:productId', isAuth, adminController.deleteProduct);

module.exports = router;