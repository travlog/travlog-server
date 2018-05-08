const express = require('express')
const router = express.Router()

const API = require('../lib/error')

const User = require('../db/user')
const Note = require('../db/note')
const auth = require('../lib/auth')

router.post('/:userId', auth.ensureAuthorized, async (req, res) => {
    const userId = req.params.userId
    const user = await User.getUserByUserId(userId)

    if (!user) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'User not found.'
        }))
    }

    const { title } = req.body

    if (!title) {
        return res.send(API.RESULT(API.CODE.ERROR, {
            msg: 'Title is required.'
        }))
    }

    const note = await Note.createNote(user.id, {
        title
    })

    return res.send(API.RESULT(API.CODE.SUCCESS, {
        id: note.id,
        title: note.title
    }))

})

router.get('/:userId', auth.ensureAuthorized, async (req, res) => {
    const userId = req.params.userId

    const user = await User.getUserByUserId(userId)

    if (!user) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'User not found.'
        }))
    }
    const notes = await Note.getList(user.id)

    return res.send(API.RESULT(API.CODE.SUCCESS, {
        notes: notes
    }))
})

module.exports = router
