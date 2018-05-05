const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../lib/error')

const User = require('../db/user')
const auth = require('../lib/auth')
const TRAVLOG_SECRET = 'travlog-secret'

async function signUpWithSNS(userId, name, email, type) {
    const user = await User.createUser({
        userId, name
    })

    const account = await User.createAccount({
        email, userId, type, name
    })

    return { user, account }
}

function authorize(userId, type, cb) {
    console.log('authorize: userId? ' + userId + ', type? ' + type)
    jwt.sign({
        id: userId,
        type: type
    },
        TRAVLOG_SECRET,
        (err, token) => {
            if (err) {
                console.log('authorize: err? ' + err)
                cb(err, null)
            } else {
                console.log('authorize: token? ' + token)
                cb(null, token)
            }
        })
}

/* GET home page. */
router.get('/', (req, res, next) => {
    res.send(API.RESULT(API.CODE.SUCCESS, {
        coin: 'gazuaaaaaaaaaa'
    }))
})

router.post('/signup', async (req, res, next) => {
    const { email = '', name = '' } = req.body
    let { userId = '', password = '', type = '' } = req.body

    // 이메일 가입
    if (!userId && (!email || !password)) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign up with Email & Password.'
        }))
    }

    // SNS 가입
    if ((userId && !type) || (!userId && type)) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign up with SNS.'
        }))
    }

    let user
    let account

    if (!userId) {

        // 이메일 회원 가입
        if (await User.checkEmailAccountDuplicated(email)) {

            // 이메일 중복
            return res.send(API.RESULT(API.CODE.ERROR.DUPLICATED, {
                msg: 'Email already exists.'
            }))
        } else {
            userId = await User.generateUserId()

            console.log('generateUserId? ' + userId)

            type = 'travlog'

            user = await User.createUser({
                userId, password, name
            })

            console.log('createUser? ' + JSON.stringify(user))

            account = await User.createAccount({
                email, userId, type, name
            })

            console.log('createAccount? ' + JSON.stringify(account))
        }
    } else {

        // SNS 회원가입
        if (await User.checkSnsAccountDuplicated(userId, type)) {

            // 로그인
            user = await User.getUserByUserId(userId)
            console.log('getUserByUserId? ' + JSON.stringify(user))
            account = user.Accounts[0]
        } else {
            // 가입
            ({ user, account } = await signUpWithSNS(userId, name, email, type))
        }
    }

    authorize(user.userId, account.type, (err, token) => {
        if (err) {
            res.send(API.RESULT(API.CODE.ERROR, {
                msg: 'hi'
            }))
        } else {
            res.send(API.RESULT(API.CODE.SUCCESS, {
                user: {
                    userId: user.userId,
                    name: user.name
                },
                accessToken: token
            }))
        }
    })
})

router.post('/signin', async (req, res, next) => {
    const { userId = '', email = '', name = '', type = '' } = req.body
    let password = req.body.password

    // 이메일 로그인
    if (!userId && (!email || !password)) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign in with Email & Password.'
        }))
    }

    // SNS 로그인
    if ((userId && !type) || (!userId && type)) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign in with SNS.'
        }))
    }

    let user
    let account

    if (!userId) {

        // 이메일 로그인
        user = await User.getUserByEmailAndPassword(email, password)

        console.log('getUserByEmailAndPassword? ' + JSON.stringify(user))

        if (!user) {
            return res.send(API.RESULT(API.CODE.NOT_FOUND, {
                msg: 'Failed to sign in with email and password.'
            }))
        }
    } else {

        // SNS 로그인
        user = await User.getUserByUserId(userId)

        console.log('getUserByUserId? ' + JSON.stringify(user));

        if (!user) {
            ({ user, account } = await signUpWithSNS(userId, name, email, type))
        }
    }

    account = await User.getAccountByUserId(user.userId)

    authorize(user.userId, account.type, (err, token) => {
        if (err) {
            res.send(API.RESULT(API.CODE.ERROR, {
                msg: 'hi'
            }))
        } else {
            res.send(API.RESULT(API.CODE.SUCCESS, {
                user: {
                    userId: user.userId,
                    name: user.name,
                    username: user.username
                },
                accessToken: token
            }))
        }
    })
})

module.exports = router
