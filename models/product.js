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
            products.push(this);
            
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll = (callback) => {
        getProductsFromFile(callback);
    }
}