const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/config.json')[env];
const mongoose = require('mongoose')
const expect = require('chai').expect

describe('UserTest', function() {

    before(() => {
        mongoose.Promise = Promise;
        const mongoUri = config.mongo.url
        mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } })
        mongoose.connection.on('error', () => {
            throw new Error(`unable to connect to database: ${mongoUri}`)
        })
    })

    it('should be connect mongo', () => {
        const connected = 2
        expect(mongoose.connection.readyState).to.be.equal(connected);
    })

    after(() => {
        console.log(mongoose.connection.readyState)
        if ([1,2].includes(mongoose.connection.readyState)) {
            mongoose.disconnect()
        }
    })

});