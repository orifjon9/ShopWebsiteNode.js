const { DataTypes } = require('sequelize');

const dbContext = require('../util/db-context');

const CartItem = dbContext.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
});

module.exports = CartItem;
