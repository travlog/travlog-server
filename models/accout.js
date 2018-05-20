'user strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
    var Account = sequelize.define('Account', {
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
        dropAt: DataTypes.DATE
    }, {})
    Account.associate = function (models) {
        models.Account.belongsTo(models.User, { foreignKey: 'uid', sourceKey: 'uid' })
    }
    return Account
}