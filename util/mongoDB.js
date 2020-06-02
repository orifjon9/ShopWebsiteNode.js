//const mongoDB = require('mongodb');
const mongoose = require('mongoose');
//const MongoDBClient = mongoDB.MongoClient;

let _db;

const mongoDBConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb+srv://shop-user:l2aFPmYxLhEjvAFU@cluster-shop-jwc7t.mongodb.net/shop-dev?retryWrites=true&w=majority')
            .then(res => resolve(res))
            .catch(err => reject(err));
        // MongoDBClient.connect('mongodb+srv://shop-user:l2aFPmYxLhEjvAFU@cluster-shop-jwc7t.mongodb.net/shop?retryWrites=true&w=majority')
        //     .then(client => {
        //         console.log('Connected!');
        //         _db = client.db();
        //         resolve();
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         reject(err);
        //     });
    });
}

const getDatabase = () => {
    if (_db) {
        return _db;
    }

    throw 'Not database found!';
}

module.exports = { mongoDBConnect, getDatabase };