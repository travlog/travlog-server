'user strict';
module.exports = (sequelize, DataTypes) => {
    var Account = sequelize.define('Account', {
        accessToken: DataTypes.STRING,
        email: DataTypes.STRING,
        type: DataTypes.STRING,
        isDrop: DataTypes.BOOLEAN,
        createdDate: DataTypes.DATE,
        updatedDate: DataTypes.DATE,
        dropDate: DataTypes.DATE
    }, {})
    Account.associate = function (models) {
        models.Account.hasMany(models.User)
    }
    return Account
}