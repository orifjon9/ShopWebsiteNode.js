const express = require('express');
const path = require('../util/path');

const productsController = require('../controllers/products');
const router = express.Router();


router.get('/', productsController.getProducts);

module.exports = router;

// more about Pug
// https://pugjs.org/api/getting-started.html