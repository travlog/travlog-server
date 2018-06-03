const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/config.json')[env];
const mongoose = require('mongoose')
const expect = require('chai').expect

describe('UserTest', function() {

    let User = null

    before(function() {
        mongoose.Promise = Promise;
        const mongoUri = config.mongo.url
        mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } })
        mongoose.connection.on('error', () => {
            throw new Error(`unable to connect to database: ${mongoUri}`)
        })

        const UserSchema = new mongoose.Schema({
            id: { type: Number },
            userId: String,
            password: String,
            name: String,
            username: String,
            profilePicture: String,
            isDrop: Boolean,
            createdDate: Date,
            updatedDate: Date,
            dropDate: Date
        });

        User = mongoose.model('user', UserSchema)
    });

    it('should be connect mongo', function() {
        const connected = 2
        expect(mongoose.connection.readyState).to.be.equal(connected);
    })

    it('expect empty userlist', async () => {
        const userList = await User.find({}, 'id userId name username profilePicture').lean().exec()
        expect(userList).to.have.lengthOf(0)
    })

    it('create user and expect find one user', async () => {
        const user = await User.create({
            id: 0,
            userId: "userId",
            password: "password",
            name: "name",
            username: "username",
            profilePicture: "profilePicture",
            isDrop: false,
            createdDate: new Date(),
            updatedDate: new Date(),
            dropDate: null
        });

        const userList = await User.find({}, 'id userId name username profilePicture').lean().exec()
        expect(userList).to.have.lengthOf(1)
    })

    //  테스트 격리를 위해 transaction 처리가 필요 함
    afterEach(async () => {
        await User.remove({})
    });

    after(function () {
        if ([1,2].includes(mongoose.connection.readyState)) {
            mongoose.disconnect()
        }
    })

})