const models = require('../models')
const uuidv1 = require('uuid/v1')

/**
 * did 생성합니다.
 * @return {did} did
 */
function generateDid() {
    const did = `d_${uuidv1()}`

    return models.Destination.find({
        attributes: ['did'],
        where: {
            did
        }
    }).then(result => {
        if (!result) {
            return did
        } else {
            return generateDid()
        }
    })
}

/**
 * destination을 생성합니다.
 * @param {*} destination destination
 */
exports.create = async (destination) => {
    destination.did = await generateDid()
    return models.Destination.create(destination)
}