const fs = require('fs');
const path = require('../util/path');
const p = path('data', 'cart.json');

const saveCartToFile = (cart, callback) => {
    fs.writeFile(p, JSON.stringify(cart), err => callback(err));
}

module.exports = class Cart {
    static addProduct(id, price) {
        // Fetch the previous cart
        Cart.getCart(cart => {
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            let updatedProduct;
            // Add new product or inclrease quantity for that
            if (existingProductIndex > -1) {
                const existingProduct = cart.products[existingProductIndex];
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;

                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +price;

            saveCartToFile(cart, err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, price) {

        Cart.getCart(cart => {
            const cartProduct = cart.products.find(prod => prod.id === id);
            if (cartProduct) {
                const updateCart = { ...cart };
                updateCart.products = updateCart.products.filter(p => p.id !== id);
                updateCart.totalPrice = updateCart.totalPrice - (cartProduct.quantity * price);

                saveCartToFile(updateCart, err => {
                    console.log(err);
                });
            }
        });
    }

    static getCart = (callback) => {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(new Buffer(fileContent).toString());
            }

            callback(cart);
        });
    }
};