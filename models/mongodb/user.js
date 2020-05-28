const { ObjectId } = require('mongodb');

const { getDatabase } = require('../../util/mongoDB');

class User {
    constructor(name, email, id, cart) {
        this.username = name;
        this.email = email;
        this.id = id;
        this.cart = cart || { items: [] };
    }

    save() {
        const db = getDatabase();

        return db.collection('users').insertOne({ username: this.username, email: this.email });
    }

    static findFirst() {
        const db = getDatabase();

        return db.collection('users').findOne().then(user => {
            return new User(user['username'], user['email'], user['_id'], user['cart'])
        });
    }

    addProductToCart = (productId) => {
        const updateCartItems = [...this.cart.items];
        const existProductInCartIndex = updateCartItems.findIndex(p => p.productId.toString() === productId.toString());

        if (existProductInCartIndex > -1) {
            updateCartItems[existProductInCartIndex].quantity = updateCartItems[existProductInCartIndex].quantity + 1;
        } else {
            updateCartItems.push({ productId: new ObjectId(productId), quantity: 1 });
        }

        var updatedCart = { items: updateCartItems };
        const db = getDatabase();

        return db.collection('users')
            .updateOne({ _id: new ObjectId(this.id) },
                {
                    $set: {
                        cart: updatedCart
                    }
                })
            .then(res => res);
    }

    getCartProducts() {
        const db = getDatabase();

        const productIdsInCart = this.cart.items.map(i => i.productId);

        return db.collection('products')
            .find({ _id: { $in: productIdsInCart } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        id: p['_id'],
                        quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
                    };
                })
            });
    }

    deleteItemFromCart(productId) {
        const updateCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString());
        const db = getDatabase();

        return db.collection('users')
            .updateOne({ _id: new ObjectId(this.id) },
                {
                    $set: {
                        cart: { items: updateCartItems }
                    }
                })
            .then(res => res);
    }

    addOrder() {
        const db = getDatabase();

       return this.getCartProducts()
            .then(products => {
                return db.collection('orders')
                    .insertOne({
                        items: products,
                        user: {
                            _id: this.id,
                            name: this.username
                        }
                    });
            })
            .then(() => {
                this.cart.items = [];
                return db.collection('users')
                    .updateOne({ _id: new ObjectId(this.id) },
                        {
                            $set: {
                                cart: { items: [] }
                            }
                        })
                    .then(res => res);
            });
    }

    getOrders() {
        const db = getDatabase();

        return db.collection('orders')
            .find({ 'user._id': new ObjectId(this.id) })
            .toArray()
            .then(orders => orders);
    }
}

module.exports.User = User;