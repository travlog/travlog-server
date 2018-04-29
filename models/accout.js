'user strict';
module.exports = (sequelize, DataTypes) => {
    var Account = sequelize.define('Account', {
        accessToken: DataTypes.STRING,
        email: DataTypes.STRING,
        userId: DataTypes.STRING,
        type: DataTypes.STRING,
        isDrop: DataTypes.BOOLEAN,
        dropAt: DataTypes.DATE
    }, {})
    Account.associate = function (models) {
        models.Account.belongsTo(models.User)
    }
    return Account
}