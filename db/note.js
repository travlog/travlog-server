const models = require('../models')
const uuidv1 = require('uuid/v1')

/**
 * nid 생성합니다.
 * @return {nid} nid
 */
function generateNid() {
    const nid = `u/${uuidv1()}`

    return models.Note.find({
        attributes: ['nid'],
        where: {
            nid
        }
    }).then(result => {
        if (!result) {
            return nid
        } else {
            return generateNid()
        }
    })
}

exports.createNote = async (note) => {
    note.nid = await generateNid()
    return models.Note.create(note)
}

exports.getList = (uid) => {
    return models.Note.findAll({
        attributes: ['nid', 'title', 'memo'],
        where: {
            uid,
            isDrop: false
        }
    })
}

exports.get = (note) => {
    return models.Note.find({
        attributes: ['nid', 'title', 'memo'],
        where: {
            uid: note.uid,
            nid: note.nid,
            isDrop: false
        }
    })
}

exports.update = (note) => {
    return models.Note.update(note,
        {
            where: {
                uid: note.uid,
                nid: note.nid
            }
        })
}

exports.delete = (uid, nid) => {
    return models.Note.update({
        dropAt: new Date(),
        isDrop: true
    },
        {
            where: {
                uid,
                nid
            }
        })
}
