const { DataTypes } = require('sequelize');

const dbContext = require('../util/db-context');

const Order = dbContext.define('order',  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
    // TODO: Add user address later
});

module.exports = Order;