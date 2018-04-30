'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Accounts', {
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
            userId: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.STRING
            },
            isDrop: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        return queryInterface.dropTable('Account');
    }
};
