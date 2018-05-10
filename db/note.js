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
