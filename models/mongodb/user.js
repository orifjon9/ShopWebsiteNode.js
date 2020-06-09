const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Product = require('../mongodb/product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resetToken: String,
    resetExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: 'Product',
                    require: true
                },
                quantity: {
                    type: Number,
                    requred: true
                }
            }]
    }
})

userSchema.methods.addProductToCart = function (productId) {
    const updateCartItems = [...this.cart.items];
    const existProductInCartIndex = updateCartItems.findIndex(p => p.productId.toString() === productId.toString());

    if (existProductInCartIndex > -1) {
        updateCartItems[existProductInCartIndex].quantity = updateCartItems[existProductInCartIndex].quantity + 1;
    } else {
        updateCartItems.push({ productId: new ObjectId(productId), quantity: 1 });
    }

    this.cart = { items: updateCartItems };
    return this.save();
}

userSchema.methods.deleteItemFromCart = function (productId) {
    const updateCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString());

    this.cart.items = updateCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };

    return this.save();
}


module.exports = mongoose.model('User', userSchema);

// class User {
//     constructor(name, email, id, cart) {
//         this.username = name;
//         this.email = email;
//         this.id = id;
//         this.cart = cart || { items: [] };
//     }

//     save() {
//         const db = getDatabase();

//         return db.collection('users').insertOne({ username: this.username, email: this.email });
//     }

//     static findFirst() {
//         const db = getDatabase();

//         return db.collection('users').findOne().then(user => {
//             return new User(user['username'], user['email'], user['_id'], user['cart'])
//         });
//     }

//     addProductToCart = (productId) => {
//         const updateCartItems = [...this.cart.items];
//         const existProductInCartIndex = updateCartItems.findIndex(p => p.productId.toString() === productId.toString());

//         if (existProductInCartIndex > -1) {
//             updateCartItems[existProductInCartIndex].quantity = updateCartItems[existProductInCartIndex].quantity + 1;
//         } else {
//             updateCartItems.push({ productId: new ObjectId(productId), quantity: 1 });
//         }

//         var updatedCart = { items: updateCartItems };
//         const db = getDatabase();

//         return db.collection('users')
//             .updateOne({ _id: new ObjectId(this.id) },
//                 {
//                     $set: {
//                         cart: updatedCart
//                     }
//                 })
//             .then(res => res);
//     }

//     getCartProducts() {
//         const db = getDatabase();

//         const productIdsInCart = this.cart.items.map(i => i.productId);

//         return db.collection('products')
//             .find({ _id: { $in: productIdsInCart } })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         id: p['_id'],
//                         quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
//                     };
//                 })
//             });
//     }

//     deleteItemFromCart(productId) {
//         const updateCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString());
//         const db = getDatabase();

//         return db.collection('users')
//             .updateOne({ _id: new ObjectId(this.id) },
//                 {
//                     $set: {
//                         cart: { items: updateCartItems }
//                     }
//                 })
//             .then(res => res);
//     }

//     addOrder() {
//         const db = getDatabase();

//        return this.getCartProducts()
//             .then(products => {
//                 return db.collection('orders')
//                     .insertOne({
//                         items: products,
//                         user: {
//                             _id: this.id,
//                             name: this.username
//                         }
//                     });
//             })
//             .then(() => {
//                 this.cart.items = [];
//                 return db.collection('users')
//                     .updateOne({ _id: new ObjectId(this.id) },
//                         {
//                             $set: {
//                                 cart: { items: [] }
//                             }
//                         })
//                     .then(res => res);
//             });
//     }

//     getOrders() {
//         const db = getDatabase();

//         return db.collection('orders')
//             .find({ 'user._id': new ObjectId(this.id) })
//             .toArray()
//             .then(orders => orders);
//     }
// }

// module.exports.User = User;