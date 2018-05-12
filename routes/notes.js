const express = require('express')
const router = express.Router()

const API = require('../lib/error')

const User = require('../db/user')
const Note = require('../db/note')
const auth = require('../lib/auth')

router.post('/', auth.ensureAuthorized, async (req, res) => {
    const user = req.user

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

router.get('/', auth.ensureAuthorized, async (req, res) => {
    const user = req.user

    const notes = await Note.getList(user.id)

    return res.send(API.RESULT(API.CODE.SUCCESS, {
        notes: notes
    }))
})

router.delete('/:noteId', auth.ensureAuthorized, async (req, res) => {
    const user = req.user
    const noteId = req.params.noteId

    const note = await Note.get(user.id, noteId)

    if (!note) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Note not found.'
        }))
    }

    const result = await Note.delete(user.id, noteId)
    console.log('delete result?', result)

    return res.send(API.RESULT(API.CODE.SUCCESS, {
        id: noteId
    }))
})

module.exports = router
