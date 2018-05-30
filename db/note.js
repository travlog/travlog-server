const models = require('../models')
const uuidv1 = require('uuid/v1')
const Location = require('../db/location')
const Destination = require('../db/destination')

/**
 * nid 생성합니다.
 * @return {nid} nid
 */
function generateNid() {
    const nid = `n_${uuidv1()}`

    return models.note.find({
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

/**
 * note를 생성합니다.
 * @param {*} note 
 */
exports.create = async (note) => {
    note.nid = await generateNid()

    if (note.Destinations) {
        for (let destination of note.Destinations) {
            const placeId = destination.Location.placeId

            let location = await Location.getItemByPlaceId(placeId)

            if (!location) {
                await Location.create(placeId).then(result => {
                    location = result
                })
            }

            if (location) {
                destination.nid = note.nid
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
    return models.note.findAll({
        attributes: ['nid', 'title', 'memo'],
        where: {
            uid,
            isDrop: false
        }
    })
}

/**
 * uid와 nid가 일치하는 한 개의 note를 가져옵니다.
 * @param {*} uid 
 * @param {*} nid 
 */
exports.getItem = (uid, nid) => {
    return models.note.find({
        attributes: ['nid', 'title', 'memo'],
        where: {
            uid, nid,
            isDrop: false
        },
        include: [{
            model: models.destination,
            where: {
                isDrop: false
            },
            include: [{
                model: models.location,
                where: {
                    isDrop: false
                }
            }]
        }]
    })
}

/**
 * note를 수정합니다.
 * @param {*} note 
 */
exports.update = (note) => {
    return models.note.update(note, {
        where: {
            uid: note.uid,
            nid: note.nid
        }
    })
}

/**
 * note를 삭제합니다.
 * @param {*} uid 
 * @param {*} nid 
 */
exports.delete = (uid, nid) => {
    return models.note.update({
        dropAt: new Date(),
        isDrop: true
    },
        {
            where: {
                uid, nid
            }
        })
}
