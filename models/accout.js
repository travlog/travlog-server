'user strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
    var Account = sequelize.define('account', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: models.User, key: 'uid'
            }
        },
        email: DataTypes.STRING,
        userId: DataTypes.STRING,
        name: DataTypes.STRING,
        profilePicture: DataTypes.STRING,
        provider: DataTypes.STRING,
        isDrop: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        dropAt: DataTypes.DATE
    }, {})
    Account.associate = function (models) {
        models.account.belongsTo(models.user, { foreignKey: 'uid', targetKey: 'uid' })
    }
    return Account
}