'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    userId: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    isDrop: DataTypes.BOOLEAN,
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
    dropDate: DataTypes.DATE
  }, {})
  User.associate = function(models) {
    // associations can be defined here
      models.User.hasMany(models.Note, {foreignKey: 'id'}),
      models.User.hasMany(models.Account, {foreignKey: 'id'})
  }
  return User
}