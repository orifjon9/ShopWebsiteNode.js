const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shopdb', 'root', 'qazqaz', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;