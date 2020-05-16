const { DataTypes } = require('sequelize');
const dbContext = require('../util/db-context');

const User = dbContext.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = User;