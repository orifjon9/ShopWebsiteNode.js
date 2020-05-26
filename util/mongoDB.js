const mongoDB = require('mongodb');
const MongoDBClient = mongoDB.MongoClient;

let _db;

const mongoDBConnect = () => {
    return new Promise((resolve, reject) => {
        MongoDBClient.connect('mongodb+srv://shop-user:l2aFPmYxLhEjvAFU@cluster-shop-jwc7t.mongodb.net/shop?retryWrites=true&w=majority')
            .then(client => {
                console.log('Connected!');
                _db = client.db();
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

const getDatabase = () => {
    if(_db){
        return _db;
    }

    throw 'Not database found!';
}

module.exports = { mongoDBConnect, getDatabase };