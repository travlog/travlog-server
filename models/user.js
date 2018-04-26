'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    userId: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    isDrop: DataTypes.BOOLEAN,
    createdDate: DataTypes.DATE,
    updatedData: DataTypes.DATE,
    dropDate: DataTypes.DATE
  }, {})
  user.associate = function(models) {
    // associations can be defined here
  }
  return user
}