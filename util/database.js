const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'shopdb',
    user: 'root',
    password: 'qazqaz'
});

module.exports = pool.promise();