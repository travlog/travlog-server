const models = require('../models')

exports.createNote = (note) => {
    return models.Note.create(note)
}

exports.getList = (u_id) => {
    return models.Note.findAll({
        attributes: ['id', 'title', 'memo'],
        where: {
            u_id: u_id,
            isDrop: false
        }
    })
}

exports.get = (note) => {
    return models.Note.find({
        attributes: ['id', 'title', 'memo'],
        where: {
            u_id: note.u_id,
            id: note.id,
            isDrop: false
        }
    })
}

exports.update = (note) => {
    return models.Note.update(note,
        {
            where: {
                u_id: note.u_id,
                id: note.id
            }
        })
}

exports.delete = (u_id, noteId) => {
    return models.Note.update({
        dropAt: new Date(),
        isDrop: true
    },
        {
            where: {
                u_id: u_id,
                id: noteId
            }
        })
}
