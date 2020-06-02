//const mongodb = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//const { getDatabase } = require('../../util/mongoDB');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User', // named module,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);