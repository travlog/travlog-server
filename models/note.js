'use strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: models.User, key: 'uid'
      }
    },
    title: DataTypes.STRING,
    memo: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    isDrop: DataTypes.BOOLEAN,
    dropAt: DataTypes.DATE
  }, {})
  Note.associate = function (models) {
    models.Note.belongsTo(models.User, { foreignKey: 'uid', sourceKey: 'uid' })
  }
  return Note
}