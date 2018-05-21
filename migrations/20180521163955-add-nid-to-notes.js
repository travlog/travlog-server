'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('notes', 'nid', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('notes', 'nid')
  }
};
