const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../lib/error')

const User = require('../db/user')

const TRAVLOG_SECRET = 'travlog-secret'

function ensureAuthorized(req, res, next) {
    var bearerToken = req.headers["authorization"]
    if (typeof bearerToken !== 'undefined') {
        try {
            const decodedToken = jwt.verify(bearerToken, TRAVLOG_SECRET)
            if (decodedToken && decodedToken.id) {
                req.token = bearerToken
                req.info = decodedToken
                console.log(decodedToken)
                return next()
            }   
        } catch (e) {
            console.error(e)
        }
    }
    res.status(401).send(API.RESULT(API.CODE.ERROR.NOT_AUTHORIZED, {
        msg: 'call 911 carrera 4 gts cabriolet'
    }))
}

/* GET home page. */
router.get('/', ensureAuthorized, (req, res, next) => {
    res.send(API.RESULT(API.CODE.SUCCESS, {
        coin: 'gazuaaaaaaaaaa'
    }))
})

router.post('/signup', async (req, res, next) => {
    var userId = req.body.userId
    var password = req.body.password
    var email = req.body.email
    var name = req.body.name
    var type = req.body.type

    var user
    var account

    if (typeof userId == 'undefined') {

        // 이메일 회원 가입
        if (await User.checkEmailAccountDuplicated(email) != null) {

            // 이메일 중복
            res.status(422).json({
                code: 422,
                msg: 'Email already exists.'
            })
            return
        } else {
            userId = await User.generateUserId()

            console.log('generated userId: ' + userId)

            type = 'travlog'

            user = await User.createUser({
                userId, password, name
            })

            console.log('created user: ' + JSON.stringify(user))

            account = await User.createAccount({
                email, userId, type
            })

            console.log('created account: ' + JSON.stringify(account))

        }
    } else {

        // SNS 회원가입
        if (await User.checkSnsAccountDuplicated(userId, type) != null) {

            // 로그인
            user = await User.getUser(userId)
            console.log('selected user: ' + JSON.stringify(user))
            account = user.Accounts[0]
        } else {

            // 가입
            user = await User.createUser({
                userId, name
            })

            account = await User.createAccount({
                email, userId, type
            })
        }
    }

    jwt.sign({
        id: user.userId,
        type: account.type
    },
        TRAVLOG_SECRET,
        (err, token) => {
            res.send(API.RESULT(API.CODE.SUCCESS, {
                user: {
                    userId: user.userId,
                    name: user.name
                },
                accessToken: token
            }))
        })
});

module.exports = router
