const { getDatabase } = require('../../util/mongoDB');

class User {
    constructor(name, email, id) {
        this.username = name;
        this.email = email;
        this.id = id;
    }

    save() {
        const db = getDatabase();

        return db.collection('users').insertOne({ username: this.username, email: this.email });
    }

    static findFirst() {
        const db = getDatabase();

        return db.collection('users').findOne().then(user => {
            return {
                ...user,
                id: user['_id']
            }
        });
    }
}

module.exports.User = User;