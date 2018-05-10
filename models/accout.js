'user strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
    var Account = sequelize.define('Account', {
        u_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: models.User, key: 'id'
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
        models.Account.belongsTo(models.User, { foreignKey: 'u_id' })
    }
    return Account
}