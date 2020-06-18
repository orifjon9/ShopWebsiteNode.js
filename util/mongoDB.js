//const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
//const MongoDBClient = mongoDB.MongoClient;
const mongoDBStoreSession = require('connect-mongodb-session')(session);

let _db;

const sessionStore = (MONGODB_URI) => new mongoDBStoreSession({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const mongoDBConnect = (MONGODB_URI) => {
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