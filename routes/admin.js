const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/products/add', isAuth, adminController.getAddProduct);
router.get('/products/:productId/edit', isAuth, adminController.getEditProduct);
router.get('/products', isAuth, adminController.getProducts);

router.post('/products', isAuth,
    [
        body('title', 'Please, enter a valid title')
            .isAlphanumeric()
            .isLength({ min: 5 })
            .trim(),
        body('imageUrl', 'Please, enter a valid image URL')
            .isURL(),
        body('price', 'Please, enter a valid price')
            .isFloat(),
        body('description', 'Please, enter a valid description')
            .isAlphanumeric()
            .isLength({ min: 20 })
            .trim(),
    ],
    adminController.postProduct);
router.put('/products/:productId', isAuth,
    [
        body('title', 'Please, enter a valid title')
            .isAlphanumeric()
            .isLength({ min: 5 })
            .trim(),
        body('imageUrl', 'Please, enter a valid image URL')
            .isURL(),
        body('price', 'Please, enter a valid price')
            .isFloat(),
        body('description', 'Please, enter a valid description')
            .isAlphanumeric()
            .isLength({ min: 20 })
            .trim(),
    ], adminController.putProduct);
router.delete('/products/:productId', isAuth, adminController.deleteProduct);

module.exports = router;