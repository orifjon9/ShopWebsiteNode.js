//const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
//const MongoDBClient = mongoDB.MongoClient;
const mongoDBStoreSession = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://shop-user:l2aFPmYxLhEjvAFU@cluster-shop-jwc7t.mongodb.net/shop-dev';

let _db;

const sessionStore = new mongoDBStoreSession({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const mongoDBConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(MONGODB_URI)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}

const getDatabase = () => {
    if (_db) {
        return _db;
    }

    throw 'Not database found!';
}

module.exports = { mongoDBConnect, getDatabase, sessionStore };