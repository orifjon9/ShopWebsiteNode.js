const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);