const express = require('express')
const router = express.Router()

const API = require('../lib/error')

const User = require('../db/user')
const Note = require('../db/note')
const auth = require('../lib/auth')

router.post('/', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.uid

    const { title, Destinations } = req.body

    if (!title) {
        return res.send(API.RESULT(API.CODE.ERROR, {
            msg: 'Title is required.'
        }))
    }

    const noteParams = {
        uid, title, Destinations
    }

    try {
        const result = await Note.create(noteParams)

        const note = await Note.getItem(uid, result.nid)
        
        return res.send(API.RESULT(API.CODE.SUCCESS, note))
    } catch (e) {
        console.error(e)
        return res.send(API.RESULT(API.CODE.ERROR.DEFAULT))
    }
})

router.get('/', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.uid

    try {
        const notes = await Note.getListByUid(uid)
        return res.send(API.RESULT(API.CODE.SUCCESS, {
            list: notes
        }))
    } catch (e) {
        console.error(e)
        return res.send(API.RESULT(API.CODE.ERROR.DEFAULT))
    }
})

router.get('/:nid', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.uid
    const nid = req.params.nid

    try {
        const note = await Note.getItem(uid, nid)

        if (!note) {
            return res.send(API.RESULT(API.CODE.NOT_FOUND, {
                msg: 'Note not found.'
            }))
        }

        return res.send(API.RESULT(API.CODE.SUCCESS, note))
    } catch (e) {
        console.error(e)
        return res.send(API.RESULT(API.CODE.ERROR.DEFAULT))
    }
})

router.put('/:nid', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.uid
    const nid = req.params.nid

    const { title } = req.body

    const noteParams = {
        uid, nid, title
    }

    try {
        await Note.update(noteParams)

        const note = await Note.get(noteParams)

        return res.send(API.RESULT(API.CODE.SUCCESS, note))
    } catch (e) {
        console.error(e)
        return res.send(API.RESULT(API.CODE.ERROR.DEFAULT))
    }
})

router.delete('/:nid', auth.ensureAuthorized, async (req, res) => {
    const uid = req.user.uid
    const nid = req.params.nid

    try {
        const note = await Note.getItem(uid, nid)

        if (!note) {
            return res.send(API.RESULT(API.CODE.NOT_FOUND, {
                msg: 'Note not found.'
            }))
        }

        const result = await Note.delete(uid, nid)
        console.log('delete result?', result)

        return res.send(API.RESULT(API.CODE.SUCCESS, {
            nid
        }))
    } catch (e) {
        console.error(e)
        return res.send(API.RESULT(API.CODE.ERROR.DEFAULT))
    }
})

module.exports = router
