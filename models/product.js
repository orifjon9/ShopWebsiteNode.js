const fs = require('fs');

const path = require('../util/path');
const p = path('data', 'products.json');

const getProductsFromFile = callback => {
    fs.readFile(p, (err, fileContent) => {
        if (!err) {
            return callback(JSON.parse(new Buffer(fileContent).toString()));
        }
        callback([]);
    });
}

module.exports = class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save = () => {
        getProductsFromFile(products => {
            this.id = this.getNextId(products);
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    getNextId = products => Math.max.apply(Math, products.map(p => p.id)) + 1;

    static fetchAll = (callback) => {
        getProductsFromFile(callback);
    }

    static getById = (id, callback) => {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            console.log(product);
            callback(product);
        });
    };
}