'use strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('note', {
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
        model: models.user, key: 'uid'
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
    models.note.belongsTo(models.user, { foreignKey: 'uid', sourceKey: 'uid' }),
      models.note.hasMany(models.destination, { foreignKey: 'nid', sourceKey: 'nid' })
  }
  return Note
}