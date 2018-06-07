const jwt = require('jsonwebtoken')
const TRAVLOG_SECRET = 'travlog-secret'
const User = require('../db/user')
const API = require('../lib/error')

exports.ensureAuthorized = async (req, res, next) => {
    var authorization = req.headers["authorization"]

    if (authorization) {
        const bearerToken = authorization.split(' ')[1]

        try {
            const decodedToken = jwt.verify(bearerToken, TRAVLOG_SECRET)
            if (decodedToken && decodedToken.uid && decodedToken.provider) {

                req.token = bearerToken
                req.user = await User.getUserByUserIdAndProvider(decodedToken.uid, decodedToken.provider)
                console.log('user => ', req.user)
                if (req.user) {
                    return next()
                }
            }
        } catch (e) {
            console.error('ensureAuthorized: ', e)
        }
    }
    res.sendResult(API.CODE.ERROR.NOT_AUTHORIZED, {
        msg: 'call 911 carrera 4 gts cabriolet'
    })
}
