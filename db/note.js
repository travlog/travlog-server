const models = require('../models')

exports.createNote = (note) => {
    return models.Note.create(note)
}

exports.getList = (uid) => {
    return models.Note.findAll({
        attributes: ['id', 'title', 'memo'],
        where: {
            uid,
            isDrop: false
        }
    })
}

exports.get = (note) => {
    return models.Note.find({
        attributes: ['id', 'title', 'memo'],
        where: {
            uid: note.uid,
            id: note.id,
            isDrop: false
        }
    })
}

exports.update = (note) => {
    return models.Note.update(note,
        {
            where: {
                uid: note.uid,
                id: note.id
            }
        })
}

exports.delete = (uid, noteId) => {
    return models.Note.update({
        dropAt: new Date(),
        isDrop: true
    },
        {
            where: {
                uid: uid,
                id: noteId
            }
        })
}
