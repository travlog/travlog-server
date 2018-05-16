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

    const noteParams = {
        u_id: user.id,
        title: title
    }
    const note = await Note.createNote(noteParams)

    console.log(1)
    return res.send(API.RESULT(API.CODE.SUCCESS, {
        id: note.id,
        title: note.title
    }))
})

router.get('/', auth.ensureAuthorized, async (req, res) => {
    const user = req.user

    const notes = await Note.getList(user.id)

    return res.send(API.RESULT(API.CODE.SUCCESS, {
        list: notes
    }))
})

router.get('/:noteId', auth.ensureAuthorized, async (req, res) => {
    const user = req.user
    const noteId = req.params.noteId

    const noteParams = {
        u_id: user.id,
        id: noteId
    }

    const note = await Note.get(noteParams)

    if (!note) {
        return res.send(API.RESULT(API.CODE.NOT_FOUND, {
            msg: 'Note not found.'
        }))
    }

    return res.send(API.RESULT(API.CODE.SUCCESS, note))
})

router.put('/:noteId', auth.ensureAuthorized, async (req, res) => {
    const user = req.user
    const noteId = req.params.noteId

    const { title } = req.body

    const noteParams = {
        u_id: user.id,
        id: noteId,
        title: title
    }
    await Note.update(noteParams)

    const note = await Note.get(noteParams)

    return res.send(API.RESULT(API.CODE.SUCCESS, note))
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
