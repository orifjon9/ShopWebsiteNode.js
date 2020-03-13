const fs = require('fs');

const path = require('../util/path');
const p = path('data', 'products.json');
const Cart = require('../models/cart');


const getProductsFromFile = callback => {
    fs.readFile(p, (err, fileContent) => {
        if (!err) {
            return callback(JSON.parse(fileContent));
        }
        callback([]);
    });
}

const saveProductsToFile = (products, callback) => {
    fs.writeFile(p, JSON.stringify(products), err => callback(err));
};

module.exports = class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = +price;
        this.description = description;
    }

    save = () => {
        getProductsFromFile(products => {
            this.id = this.getNextId(products);
            products.push(this);
            saveProductsToFile(products, err => {
                console.log(err);
            });
        });
    }

    update = () => {
        getProductsFromFile(products => {
            const productIndex = products.findIndex(p => p.id === this.id);
            console.log(productIndex);
            if (productIndex > -1) {
                let updatedProducts = [...products];
                updatedProducts[productIndex] = this;
                saveProductsToFile(updatedProducts, err => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById = (id) => {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            saveProductsToFile(updatedProducts, err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    getNextId = products => Math.max.apply(Math, products.map(p => p.id)) + 1 || 1;



    static fetchAll = (callback) => {
        getProductsFromFile(callback);
    }

    static getById = (id, callback) => {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === +id);
            callback(product);
        });
    };
}