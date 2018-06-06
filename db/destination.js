const models = require('../models')
const uuidv1 = require('uuid/v1')

/**
 * destination id 생성합니다.
 * @return {id} id
 */
function generateId() {
    const id = `d_${uuidv1()}`

    return models.destination.findOne({
        attributes: ['id'],
        where: {
            id
        }
    }).lean().exec().then(result => {
        if (!result) {
            return id
        } else {
            return generateId()
        }
    })
}

/**
 * destination을 생성합니다.
 * @param {*} destination destination
 */
exports.create = async (destination) => {
    destination.id = await generateId()
    return models.destination.create(destination)
}