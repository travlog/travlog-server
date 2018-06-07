const models = require('../models')
const uuidv1 = require('uuid/v1')
const Location = require('../db/location')

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

            const placeId = destination.location.placeId

            let location = await Location.getItemByPlaceId(placeId)

            if (!location) {
                await Location.create(placeId).then(result => {
                    location = result
                })
            }

            if (location) {
                // destination.nid = note.id
                destination.lid = location.id

                // destination을 note 내부 배열로 migration 하여, destination 모델을 삭제
                // await Destination.create(destination)
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
    }).then(async result => {
        if (!result) {
            return null
        }
        for (let destination of result.destinations) {
            /**
             * FIXME: destination.location 에 대한 mongo schema 정의가 없어서 그런건지,
             * 그냥 제가 허접해서 그런건지... schema에 존재하는 field를 임의로 변경하면 변경이 되는데,
             * schema에 없는 field를 새로 만들려고 하니 제대로 동작하지 않습니다...
             */
            destination.location = await Location.getItem(destination.lid)
        }

        return result
    })
}

/**
 * note를 수정합니다.
 * @param {*} note 
 */
exports.update = (note) => {
    return models.note.update({
        uid: note.uid,
        id: note.id,
        isDrop: note.isDrop
    },
        { $set: note }).exec()
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
