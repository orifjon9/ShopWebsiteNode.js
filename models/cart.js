const { DataTypes } = require('sequelize');

const dbContext = require('../util/db-context');

const Cart = dbContext.define('cart', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Cart;
