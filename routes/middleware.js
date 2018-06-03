const API = require('../lib/error')

exports.common = (req, res, next) => {
  res.sendResult = (code, data) => {
    return res.send(API.RESULT(code, data))
  }
  next()
}
