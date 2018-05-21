'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uid: { type: DataTypes.STRING, primaryKey: true },
    userId: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    isDrop: DataTypes.BOOLEAN,
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
    dropDate: DataTypes.DATE
  }, {})
  User.associate = function (models) {
    models.User.hasMany(models.Account, { foreignKey: 'uid', sourceKey: 'uid' }),
      models.User.hasMany(models.Note, { foreignKey: 'uid', sourceKey: 'uid' })
  }
  return User
}