const rq = require('request-promise-native')
const expect = require('chai').expect

const env       = process.env.NODE_ENV || 'development'
const config    = require(__dirname + '/../../config/config.json')[env]
const mongoose = require('mongoose')
const User = require(__dirname + '/../../models/user')(mongoose)
const Account = require(__dirname + '/../../models/accout')(mongoose)


describe('test note api', function() {
    this.timeout(10000)
    const baseUrl = "http://localhost:3000/api"

    const SUCCESS_CODE = 2000

    let userId = ""

    before(function() {
        mongoose.Promise = Promise;
        const mongoUri = config.mongo.url
        mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } })
        mongoose.connection.on('error', () => {
            throw new Error(`unable to connect to database: ${mongoUri}`)
        })
    });

    it('이메일로 회원 가입', async () => {
        // when
        const resSignUp = await rq.post({
            url : `${baseUrl}/signup`,
            json : {
                "email" : "rkd@gmail.com",
                "password" : "rkd123"
            }
        })

        // then
        expect(resSignUp.codeno).to.be.equal(SUCCESS_CODE)
        userId = resSignUp.data.user.id
        //expect(resSignUp).to.be.equal({})
    })

    it('이메일로 로그인', async () => {
        // given
        const resSignUp = await rq.post({
            url : `${baseUrl}/signup`,
            json : {
                "email" : "rkd@gmail.com",
                "password" : "rkd123"
            }
        })

        expect(resSignUp.codeno).to.be.equal(SUCCESS_CODE)
        userId = resSignUp.data.user.id
        //expect(resSignUp).to.be.equal({})

        // when
        const resSignIn = await rq.post({
            url : `${baseUrl}/signin`,
            json : {
                "loginId" : "rkd@gmail.com",
                "password" : "rkd123"
            }
        })

        // then
        expect(resSignIn.codeno).to.be.equal(SUCCESS_CODE)
    })


    //  테스트 격리를 위해 transaction 처리가 필요 함
    afterEach(async () => {
        await User.remove({id : userId}).exec()
        await Account.remove({uid : userId}).exec()
    })

    after(function () {
        if ([1,2].includes(mongoose.connection.readyState)) {
            mongoose.disconnect()
        }
    })

})