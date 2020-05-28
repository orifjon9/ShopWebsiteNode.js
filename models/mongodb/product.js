const mongodb = require('mongodb');

const { getDatabase } = require('../../util/mongoDB');


class Product {
    constructor(title, description, price, imageUrl, id, userId) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.id = id;
        this.userId = userId;
    }

    save() {
        const db = getDatabase();
        if (this.id) {
            return db.collection('products')
                .updateOne({ _id: new mongodb.ObjectId(this.id) },
                    {
                        $set: {
                            title: this.title,
                            description: this.description,
                            price: this.price,
                            imageUrl: this.imageUrl
                        }
                    })
                .then(result => console.log(result))
                .catch(err => console.log(err));
        } else {
            return db.collection('products')
                .insertOne({
                    title: this.title,
                    description: this.description,
                    price: this.price,
                    imageUrl: this.imageUrl,
                    userId: this.userId
                })
                .then(result => console.log(result))
                .catch(err => console.log(err));
        }
    }

    static fetchAll() {
        const db = getDatabase();

        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                const newProducts = products.map(product => {
                    return {
                        ...product,
                        id: product["_id"]
                    };
                });
                console.log(newProducts);
                return newProducts;
            })
            .catch(err => console.log(err));
    }

    static getProductById(productId) {
        const db = getDatabase();

        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(productId) })
            .next()
            .then(product => {
                console.log(product);
                return {
                    ...product,
                    id: product["_id"]
                };
            })
            .catch(err => console.log(err));
    }

    static deleteById(productId) {
        const db = getDatabase();

        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(productId) })
            .then(result => result)
            .catch(err => console.log(err));
    }
}

module.exports = Product;