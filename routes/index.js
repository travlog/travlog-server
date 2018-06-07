const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../lib/error')

const User = require('../db/user')
const auth = require('../lib/auth')
const TRAVLOG_SECRET = 'travlog-secret'
const fbGraph = require('fbgraph')
const googleapis = require('googleapis')

const oAuth2Client = new googleapis.google.auth.OAuth2(
    global.config.google.clientId,
    global.config.google.clientSecret,
    ''
)

async function signUpWithSNS(userId, name, email, profilePicture, provider) {
    const user = await User.createUser({
        userId, name, profilePicture
    })

    const uid = user.id

    const account = await User.createAccount({
        email, userId, provider, name, profilePicture, uid
    })

    console.log('user => ', user, 'account => ', account)

    return { user, account }
}

function authorize(userId, provider, cb) {
    if (!userId || !provider) {
        cb(new Error('userId and provider is required'), null)
    }
    jwt.sign({
        userId, provider
    },
        TRAVLOG_SECRET,
        (err, token) => {
            if (err) {
                cb(err, null)
            } else {
                cb(null, token)
            }
        })
}

/**
 * 이메일 회원가입
 */
router.post('/signup', async (req, res) => {
    const email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        return res.sendResult(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign up with Email & Password.'
        })
    }

    const provider = 'travlog'

    try {
        if (await User.getAccountByEmail(email, provider)) {
            // 이메일 중복
            return res.sendResult(API.CODE.ERROR.DUPLICATED, {
                msg: 'Email already exists.'
            })
        } else {
            const user = await User.createUser({
                password
            })

            const uid = user.id
            const userId = user.userId

            const account = await User.createAccount({
                uid, userId, email, provider
            })

            authorize(user.userId, account.provider, (err, token) => {
                if (err) {
                    console.error(err)
                    return res.sendResult(API.CODE.ERROR.DEFAULT)
                } else {
                    res.sendResult(API.CODE.SUCCESS, {
                        user: {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            profilePicture: user.profilePicture
                        },
                        accessToken: token
                    })
                }
            })
        }
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
        // return res.send(API.RESULT(API.CODE.ERROR.DEFAULT))
    }
})

/**
 * password 로그인
 */
router.post('/signin', async (req, res, next) => {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res.sendResult(API.CODE.NOT_FOUND, {
            msg: 'Failed to sign in with password.'
        })
    }

    try {
        const user = await User.getUserByLoginIdAndPassword(loginId, password)

        if (!user) {
            return res.sendResult(API.CODE.NOT_FOUND, {
                msg: 'Failed to sign in with password.'
            })
        }

        const account = await User.getAccountByUid(user.id)

        authorize(user.userId, account.provider, (err, token) => {
            if (err) {
                res.sendResult(API.CODE.ERROR.DEFAULT, {
                    msg: 'hi'
                })
            } else {
                res.sendResult(API.CODE.SUCCESS, {
                    user: {
                        userId: user.userId,
                        name: user.name,
                        username: user.username,
                        profilePicture: user.profilePicture
                    },
                    accessToken: token
                })
            }
        })
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
    }
})

router.post('/oauth', async (req, res) => {
    const { token, provider } = req.body

    if (!token || !provider) {
        return res.sendResult(API.CODE.NOT_FOUND, {
            msg: 'bye'
        })
    }

    new Promise(resolve => {
        if (provider == 'facebook') {
            fbGraph.setAccessToken(token)

            fbGraph.get('me?fields=email,name,picture', (err, res) => {
                if (err) {
                    console.error(err)
                    resolve(null)
                } else {
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

                    resolve({
                        userId: payload.sub,
                        profilePicture: payload.picture,
                        email: payload.email,
                        name: payload.name,
                    })
                }
            })
        }
    }).then(async result => {
        if (!result) {
            return res.sendResult(API.CODE.ERROR.DEFAULT)
        } else {
            ({ userId, profilePicture, email, name } = result)

            let user = await User.getUserByUserId(userId)

            let account

            if (!user) {
                ({ user, account } = await signUpWithSNS(userId, name, email, profilePicture, provider))
            } else {
                await User.updateUserId(user.id, userId)
            }

            // account = await User.getAccountByUserId(userId)

            console.log('userId => ', userId, 'account =>', account)

            authorize(userId, account.provider, (err, token) => {
                if (err) {
                    console.error(err)
                    return res.sendResult(API.CODE.ERROR.DEFAULT)
                } else {
                    return res.sendResult(API.CODE.SUCCESS, {
                        user: {
                            userId: user.userId,
                            name: user.name,
                            username: user.username,
                            profilePicture: user.profilePicture
                        },
                        accessToken: token
                    })
                }
            })
        }
    })
})

module.exports = router
