const rq = require('request-promise-native')
const expect = require('chai').expect
const mongoose = require('mongoose')

const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../../config/config.json')[env];

const User = require(__dirname + '/../../models/user')(mongoose)

describe('test note api', function() {
    this.timeout(10000)
    const baseUrl = "http://localhost:3000/api"

    const SUCCESS_CODE = 2000
    let accessToken = ""
    let userId = ""

    before(async () => {
        mongoose.Promise = Promise
        const mongoUri = config.mongo.url
        mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } })
        mongoose.connection.on('error', () => {
            throw new Error(`unable to connect to database: ${mongoUri}`)
        })

        const resSignUp = await rq.post({
            url : `${baseUrl}/signup`,
            json : {
                "email" : "rkd@gmail.com",
                "password" : "rkd123"
            }
        })

        expect(resSignUp.codeno).to.equal(SUCCESS_CODE)

        accessToken = resSignUp.data.accessToken
        expect(accessToken).to.not.equal("")

    })

    it('노트 생성', async () => {
        const resCreateNote = await rq.post({
            headers : {
                Authorization: `Bearer ${accessToken}`
            },
            url : `${baseUrl}/notes`,
            json : {
                "title":"title",
                "destination":{
                    "placeId":"ChIJzWXFYYuifDUR64Pq5LTtioU",
                    "startDate":"2018-05-23 15:39:41",
                    "endDate":"2018-05-27 15:39:41"
                }
            }
        })

        expect(resCreateNote.codeno).to.be.equal(SUCCESS_CODE)
        const createNote = resCreateNote.data

        const resGetNote = await rq.get({
            headers : {
                Authorization: `Bearer ${accessToken}`
            },
            url : `${baseUrl}/notes/${createNote.id}`,
            json : true
        })

        expect(resGetNote.codeno).to.be.equal(SUCCESS_CODE)
    })

    //  테스트 격리를 위해 transaction 처리가 필요 함
    afterEach(async () => {
        await User.remove({}).exec()
    })

    after(function () {
        if ([1,2].includes(mongoose.connection.readyState)) {
            mongoose.disconnect()
        }
    })

})