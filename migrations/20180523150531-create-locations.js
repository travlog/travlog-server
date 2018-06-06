'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lid: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      locality: {
        type: Sequelize.STRING
      },
      administrativeAreaLevel1: {
        type: Sequelize.STRING
      },
      administrativeAreaLevel2: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
      },
      name: {
        type: Sequelize.STRING
      },
      placeId: {
        unique: true,
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      isDrop: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      dropAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Locations');
  }
};