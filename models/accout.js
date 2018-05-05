'user strict';
module.exports = (sequelize, DataTypes) => {
    var Account = sequelize.define('Account', {
        email: DataTypes.STRING,
        userId: DataTypes.STRING,
        name: DataTypes.STRING,
        profilePicture: DataTypes.STRING,
        type: DataTypes.STRING,
        isDrop: DataTypes.BOOLEAN,
        dropAt: DataTypes.DATE
    }, {})
    Account.associate = function (models) {
        models.Account.belongsTo(models.User)
    }
    return Account
}