const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../lib/error')

const User = require('../db/user')
const auth = require('../lib/auth')
const TRAVLOG_SECRET = 'travlog-secret'
const fbGraph = require('fbgraph')
const googleapis = require('googleapis')
const config = require('../config/dev')

const oAuth2Client = new googleapis.google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret
)

async function signUpWithSNS(userId, name, email, profilePicture, provider) {
    const user = await User.createUser({
        userId, name, profilePicture
    })

    const u_id = user.id

    const account = await User.createAccount({
        email, userId, provider, name, profilePicture, u_id
    })

    return { user, account }
}

function authorize(userId, provider, cb) {
    console.log('authorize: userId? ' + userId + ', provider? ' + provider)
    jwt.sign({
        id: userId,
        provider: provider
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

router.post('/signup', async (req, res) => {
    const email = req.body.email
    let password = req.body.password

    // 이메일 가입
    if (!email || !password) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign up with Email & Password.'
        }))
    }

    const provider = 'travlog'
    let user
    let account

    // 이메일 회원 가입
    if (await User.getAccountByEmail(email, provider)) {

        // 이메일 중복
        return res.send(API.RESULT(API.CODE.ERROR.DUPLICATED, {
            msg: 'Email already exists.'
        }))
    } else {
        const userId = await User.generateUserId()

        console.log('generateUserId? ' + userId)

        user = await User.createUser({
            userId, password
        })

        console.log('createUser? ' + JSON.stringify(user))

        const u_id = user.id

        account = await User.createAccount({
            email, userId, provider, u_id
        })

        console.log('createAccount? ' + JSON.stringify(account))
    }

    authorize(user.userId, account.provider, (err, token) => {
        if (err) {
            res.send(API.RESULT(API.CODE.ERROR, {
                msg: 'hi'
            }))
        } else {
            res.send(API.RESULT(API.CODE.SUCCESS, {
                user: {
                    userId: user.userId,
                    name: user.name,
                    username: user.username,
                    profilePicture: user.profilePicture
                },
                accessToken: token
            }))
        }
    })
})

router.post('/signin', async (req, res, next) => {
    const loginId = req.body.loginId
    let password = req.body.password

    // 이메일 || username 로그인
    if (!loginId || !password) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign in with password.'
        }))
    }

    let user
    let account

    // 이메일 로그인
    user = await User.getUserByEmailAndPassword(loginId, password)

    if (!user) {
        user = await User.getUserByUsernameAndPassword(loginId, password)
    }

    console.log('getUserByLoginIdAndPassword? ' + JSON.stringify(user))

    if (!user) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign in with password.'
        }))
    }

    account = await User.getAccountByUserId(user.userId)

    authorize(user.userId, account.provider, (err, token) => {
        if (err) {
            res.send(API.RESULT(API.CODE.ERROR, {
                msg: 'hi'
            }))
        } else {
            res.send(API.RESULT(API.CODE.SUCCESS, {
                user: {
                    userId: user.userId,
                    name: user.name,
                    username: user.username,
                    profilePicture: user.profilePicture
                },
                accessToken: token
            }))
        }
    })
})

router.post('/oauth', async (req, res) => {
    const { token, provider } = req.body

    if (!token || !provider) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'bye'
        }))
    }

    let userId
    let profilePicture
    let email
    let name

    new Promise(resolve => {
        if (provider == 'facebook') {
            fbGraph.setAccessToken(token)

            fbGraph.get('me?fields=email,name,picture', (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)

                    resolve({
                        userId: res.id,
                        profilePicture: res.picture.data.url,
                        email: res.email,
                        name: res.name,
                    })
                }
            })
        } else if (provider == 'google') {
            oAuth2Client.verifyIdToken({
                idToken: token
            }, (err, res) => {
                if (err) {
                    console.error(err)
                    resolve(null)
                } else {
                    const payload = res.payload
                    console.log('payload? ' + JSON.stringify(payload))

                    resolve({
                        userId: payload.sub,
                        profilePicture: payload.picture,
                        email: payload.email,
                        name: payload.name,
                    })
                }
            })
        } else {
            resolve(null)
        }
    }).then(async result => {
        if (!result) {
            return res.send(API.RESULT(API.CODE.ERROR, {
                msg: 'nono'
            }))
        } else {
            ({ userId, profilePicture, email, name } = result)

            let user = await User.getUserByUserId(userId)
            let account

            if (!user) {
                ({ user, account } = await signUpWithSNS(userId, name, email, profilePicture, provider))
            } else {
                await User.updateUserId(user.id, userId)
            }

            account = await User.getAccountByUserId(userId)

            console.log('getAccountByUserId? ' + JSON.stringify(account))

            authorize(userId, account.provider, (err, token) => {
                if (err) {
                    return res.send(API.RESULT(API.CODE.ERROR, {
                        msg: 'hi'
                    }))
                } else {
                    return res.send(API.RESULT(API.CODE.SUCCESS, {
                        user: {
                            userId: user.userId,
                            name: user.name,
                            username: user.username,
                            profilePicture: user.profilePicture
                        },
                        accessToken: token
                    }))
                }
            })
        }
    })
})

module.exports = router
