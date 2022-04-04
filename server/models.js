const { Sequelize } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isActivated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    activationLink: {
        type: Sequelize.STRING,
    }
})

const Token = sequelize.define('token', {
    refreshToken: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
    User, Token, sequelize
}