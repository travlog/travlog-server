const express = require('express')
const router = express.Router()
const API = require('../lib/error')

const User = require('../db/user')

const auth = require('../lib/auth')

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.put('/:userId', auth.ensureAuthorized, async (req, res, next) => {
  const userId = req.params.userId
  const username = req.body.username || ''

  await User.updateUsername(userId, username)

  const user = await User.getUserByUsername(username)

  return res.send(API.RESULT(API.CODE.SUCCESS, {
    user: user
  }))
})

router.get('/:username', async (req, res) => {
  const username = req.params.username

  const user = await User.getUserByUsername(username)

  if (!user) {
    return res.send(API.RESULT(API.CODE.NOT_FOUND, {
      msg: 'nope'
    }))
  }
  return res.send(API.RESULT(API.CODE.SUCCESS, {
    user: user
  }))
})

module.exports = router
