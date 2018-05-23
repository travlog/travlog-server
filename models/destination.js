'use strict';
const models = require('../models')

module.exports = (sequelize, DataTypes) => {
  var Destination = sequelize.define('Destination', {
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
        model: models.Note, key: 'nid'
      }
    },
    lid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: models.Location, key: 'lid'
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
    models.Destination.belongsToMany(models.Note, { through: 'note_destination' }),
      models.Destination.belongsTo(models.Location, { foreignKey: 'lid', sourceKey: 'lid' })
  };
  return Destination;
};