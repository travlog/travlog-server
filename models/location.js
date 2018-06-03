'use strict';
module.exports = (sequelize, DataTypes) => {
  var Location = sequelize.define('location', {
    lid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    locality: DataTypes.STRING,
    administrativeAreaLevel1: DataTypes.STRING,
    administrativeAreaLevel2: DataTypes.STRING,
    country: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    placeId: DataTypes.STRING,
    reference: DataTypes.STRING,
    isDrop: DataTypes.BOOLEAN,
    dropAt: DataTypes.DATE
  }, {});
  Location.associate = function (models) {
    models.location.hasMany(models.destination, { foreignKey: 'lid', sourceKey: 'lid' })
  };
  return Location;
};