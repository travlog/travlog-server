'use strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
  var Destination = sequelize.define('destination', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    did: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    nid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: models.note, key: 'nid'
      }
    },
    lid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: models.location, key: 'lid'
      }
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    isDrop: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    dropAt: DataTypes.DATE
  }, {});
  Destination.associate = function (models) {
    models.destination.belongsTo(models.note, { foreignKey: 'nid', targetKey: 'nid' }),
      models.destination.belongsTo(models.location, { foreignKey: 'lid', targetKey: 'lid' })
  };
  return Destination;
};