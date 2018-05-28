const express = require('express')
const router = express.Router()
const API = require('../lib/error')

const User = require('../db/user')

const auth = require('../lib/auth')
const fbGraph = require('fbgraph')
const googleapis = require('googleapis')
const config = require('../config/dev')

const oAuth2Client = new googleapis.google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret
)

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.sendResult(API.CODE.SUCCESS, 'respond with a resource')
})

router.put('/:userId', auth.ensureAuthorized, async (req, res, next) => {
  const userId = req.params.userId
  const username = req.body.username || ''

  await User.updateUsername(userId, username)

  const user = await User.getUserByUsername(username)

  return res.sendResult(API.CODE.SUCCESS, {
    user: user
  })
})

router.get('/:username', async (req, res) => {
  const username = req.params.username

  const user = await User.getUserByUsername(username)

  if (!user) {
    return res.sendResult(API.CODE.NOT_FOUND, {
      msg: 'nope'
    })
  }
  return res.sendResult(API.CODE.SUCCESS, {
    user: user
  })
})

router.put('/:userId/link', auth.ensureAuthorized, async (req, res) => {
  const originalUserId = req.params.userId
  const { token, provider } = req.body

  if (!token || !provider) {
    return res.sendResult(API.CODE.NOT_FOUND, {
      msg: 'good bye'
    })
  }

  const user = await User.getUserByUserId(originalUserId)

  console.log('getUserByUserId: ', JSON.stringify(user))

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
  })
    .then(async result => {
      if (!result) {
        return res.sendResult(API.CODE.ERROR, {
          msg: 'nonono'
        })
      } else {
        ({ userId, profilePicture, email, name } = result)

        if (await User.checkSnsAccountDuplicated(userId, provider)) {
          // TODO: 이미 연결 된 계정인데 어떡하지...
          return res.sendResult(API.CODE.ERROR.DUPLICATED, {
            msg: 'T_T'
          })
        } else {
          const u_id = user.id
          const account = await User.createAccount({
            email, userId, provider, name, profilePicture, u_id
          })

          const accounts = await User.getLinkedAccounts(u_id)

          return res.sendResult(API.CODE.SUCCESS, {
            list: accounts
          })
        }
      }
    })
})

module.exports = router
