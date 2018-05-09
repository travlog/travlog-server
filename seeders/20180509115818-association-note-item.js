'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    faker.locale = 'ko'

    const NumberOfNotes = 50

    await queryInterface.bulkInsert('Users', [{
      userId: faker.random.number(),
      password: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    const users = await queryInterface.sequelize.query('SELECT * from Users;')
    const user = users[0][0]

    await queryInterface.bulkInsert('Accounts', [{
      u_id: user.id,
      userId: user.userId,
      email: 'fobidlim@gmail.com',
      provider: 'travlog',
      name: '말레',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    const fakeNotes = []

    for (let i = 0; i < NumberOfNotes; i++) {
      fakeNotes.push({
        u_id: user.id,
        title: faker.random.word(),
        memo: faker.random.word(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return queryInterface.bulkInsert('Notes', fakeNotes, {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Accounts', null, {})
    await queryInterface.bulkDelete('Notes', null, {})
  }
};
