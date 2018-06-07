const models = require('../models')
const uuidv1 = require('uuid/v1')
const Location = require('../db/location')
const Destination = require('../db/destination')

/**
 * note id 생성합니다.
 * @return {id} id
 */
function generateId() {
    const id = `n_${uuidv1()}`

    return models.note.findOne({
        attributes: ['id'],
        where: {
            id
        }
    }).then(result => {
        if (!result) {
            return id
        } else {
            return generateId()
        }
    })
}

/**
 * note를 생성합니다.
 * @param {*} note 
 */
exports.create = async (note) => {
    note.id = await generateId()

    if (note.destinations) {
        for (let destination of note.destinations) {
            console.log('destination => ', destination)
            const placeId = destination.location.placeId

            let location = await Location.getItemByPlaceId(placeId)

            if (!location) {
                await Location.create(placeId).then(result => {
                    location = result
                })
            }

            if (location) {
                destination.nid = note.id
                destination.lid = location.lid

                await Destination.create(destination)
            }
        }
    }

    return models.note.create(note)
}

/**
 * uid가 일치하는 note 목록을 가져옵니다.
 * @param {*} uid 
 */
exports.getListByUid = (uid) => {
    console.log('getListByUid => ', uid)
    return models.note.find({
        uid, isDrop: false
    }).exec()
}

/**
 * uid와 note가 일치하는 한 개의 note를 가져옵니다.
 * @param {*} uid 
 * @param {*} id 
 */
exports.getItem = (uid, id) => {
    return models.note.findOne({
        uid, id, isDrop: false
    }).exec()
}

/**
 * note를 수정합니다.
 * @param {*} note 
 */
exports.update = (note) => {
    return models.note.update(note, {
        where: {
            uid: note.uid,
            id: note.id
        }
    })
}

/**
 * note를 삭제합니다.
 * @param {*} uid 
 * @param {*} id note id 
 */
exports.delete = (uid, id) => {
    return models.note.update(
        { uid, id },
        {
            $set: {
                dropAt: new Date(),
                isDrop: true
            }
        }).exec()
}
