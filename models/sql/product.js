const fs = require('fs');

const db = require('../../util/database');
const Cart = require('../cart');

module.exports = class Product {
    constructor(title, imageUrl, price, description, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = +price;
        this.description = description;
        this.id = id;
    }

    save = () => {
        db.execute('INSERT INTO products(title, description, price, imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.description, this.price, this.imageUrl])
            .catch(err => console.log(err));
    }

    update = () => {
        db.execute('UPDATE products SET title = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?',
            [this.title, this.description, this.price, this.imageUrl, this.id])
            .catch(err => console.log(err));
    }

    static deleteById = (id) => {
        db.execute('DELETE products FROM WHERE id = ? ', [id])
            .then(() => {
                // TODO:
                // Cart.deleteProduct(id, product.price);
            })
            .catch(err => console.log(err));
    }

    static fetchAll = (callback) => {
        db.execute('SELECT * FROM products')
            .then(([rows, fields]) => {
                callback(rows);
            })
            .catch(err => console.log(err));
    }

    static getById = (id, callback) => {
        db.execute('SELECT * FROM products WHERE id = ? ', [id])
            .then(([rows, fields]) => {
                callback(rows[0]);
            })
            .catch(err => console.log(err));
    };
}