const models = require('../models')

exports.createNote = (u_id, note) => {
    return models.Note.create({
        u_id: u_id,
        title: note.title
    })
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

exports.get = (u_id, noteId) => {
    return models.Note.find({
        attributes: ['id', 'title', 'memo'],
        where: {
            u_id, u_id,
            id: noteId,
            isDrop: false
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
