const express = require('express')
const router = express.Router()

const API = require('../lib/error')

const User = require('../db/user')
const Note = require('../db/note')
const auth = require('../lib/auth')

router.post('/', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.id

    const { title, destinations } = req.body

    if (!title) {
        return res.sendResult(API.CODE.ERROR, {
            msg: 'Title is required.'
        })
    }

    const noteParams = {
        uid, title, destinations
    }

    try {
        const result = await Note.create(noteParams)

        const note = await Note.getItem(uid, result.id)

        return res.sendResult(API.CODE.SUCCESS, note)
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
    }
})

router.get('/', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.id
    console.log('uid => ', uid)
    try {
        const notes = await Note.getListByUid(uid)
        return res.sendResult(API.CODE.SUCCESS, {
            list: notes
        })
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
    }
})

router.get('/:noteId', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.id
    const noteId = req.params.noteId

    try {
        const note = await Note.getItem(uid, noteId)

        if (!note) {
            return res.sendResult(API.CODE.NOT_FOUND, {
                msg: 'Note not found.'
            })
        }

        return res.sendResult(API.CODE.SUCCESS, note)
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
    }
})

router.put('/:noteId', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.id
    const noteId = req.params.id

    const { title } = req.body

    const noteParams = {
        uid, noteId, title
    }

    try {
        await Note.update(noteParams)

        const note = await Note.get(noteParams)

        return res.sendResult(API.CODE.SUCCESS, note)
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
    }
})

router.delete('/:noteId', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.id
    const noteId = req.params.noteId

    try {
        // FIXME: 노트를 삭제 할 때, 해당 노트가 없다면 error를 return 해야 할 필요가 있나?
        // const note = await Note.getItem(uid, noteId)
        // 
        // if (!note) {
        //     return res.sendResult(API.CODE.NOT_FOUND, {
        //         msg: 'Note not found.'
        //     })
        // }

        const result = await Note.delete(uid, noteId)

        return res.sendResult(API.CODE.SUCCESS, {
            id: noteId
        })
    } catch (e) {
        console.error(e)
        return res.sendResult(API.CODE.ERROR.DEFAULT)
    }
})

module.exports = router
