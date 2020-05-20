const { DataTypes } = require('sequelize');

const dbContext = require('../util/db-context');

const OrderItem = dbContext.define('orderItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
});

module.exports = OrderItem;