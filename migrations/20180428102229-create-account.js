'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Account', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        accessToken: {
            allowNull: false,
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        isDrop: {
            type: Sequelize.BOOLEAN
        },
        dropDate: {
            type: Sequelize.DATE
        },
        createdDate: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedDate: {
            allowNull: false,
            type: Sequelize.DATE
        }
    });
    },
    down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Account');
    }
};
