const jwt = require('jsonwebtoken')
const TRAVLOG_SECRET = 'travlog-secret'
const User = require('../db/user')

exports.ensureAuthorized = async (req, res, next) => {
    var authorization = req.headers["authorization"]

    if (authorization) {
        const bearerToken = authorization.split(' ')[1]

        try {
            const decodedToken = jwt.verify(bearerToken, TRAVLOG_SECRET)
            if (decodedToken && decodedToken.id && decodedToken.provider) {
                console.log(decodedToken)

                req.token = bearerToken
                req.user = await User.getUserByUserIdAndProvider(decodedToken.id, decodedToken.provider)

                if (req.user) {
                    return next()
                }
            }
        } catch (e) {
            console.error('ensureAuthorized: ', e)
        }
    }
    res.send(API.RESULT(API.CODE.ERROR.NOT_AUTHORIZED, {
        msg: 'call 911 carrera 4 gts cabriolet'
    }))
}
