'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    title: DataTypes.STRING,
    memo: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
    isDrop: DataTypes.BOOLEAN,
    dropDate: DataTypes.DATE
  }, {})
  Note.associate = function(models) {
    // associations can be defined here
  }
  return Note
}