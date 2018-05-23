'use strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: models.User, key: 'uid'
      }
    },
    title: DataTypes.STRING,
    memo: DataTypes.STRING,
    isDrop: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    dropAt: DataTypes.DATE
  }, {})
  Note.associate = function (models) {
    models.Note.belongsTo(models.User, { foreignKey: 'uid', sourceKey: 'uid' }),
      models.Note.hasMany(models.Destination, { foreignKey: 'nid', sourceKey: 'nid' })
  }
  return Note
}