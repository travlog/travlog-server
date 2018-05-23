const models = require('../models')
const uuidv1 = require('uuid/v1')
const googleMapsClient = require('@google/maps').createClient({
    key: global.config.google.apiKey
})

/**
 * lid 생성합니다.
 * @return {lid} lid
 */
function generateLid() {
    const lid = `l_${uuidv1()}`

    return models.Location.find({
        attributes: ['lid'],
        where: {
            lid
        }
    }).then(result => {
        if (!result) {
            return lid
        } else {
            return generateLid()
        }
    })
}

/**
 * placeId로 Google Place API를 사용하여, location을 생성합니다.
 * @param {*} placeId placeId
 */
exports.create = async (placeId) => {
    const lid = await generateLid()

    googleMapsClient.place({
        placeid: placeId
    }, (err, response) => {
        if (err) {
            console.error(err)
            throw err
        } else {
            const result = response.json.result
            let { locality, administrativeAreaLevel1, administrativeAreaLevel2, country } = {}

            result.address_components.forEach(component => {
                component.types.forEach(type => {
                    switch (type) {
                        case 'locality':
                            locality = component.long_name
                            break
                        case 'administrative_area_level_1':
                            administrativeAreaLevel1 = component.long_name
                            break
                        case 'administrative_area_level_2':
                            administrativeAreaLevel2 = component.long_name
                            break
                        case 'country':
                            country = component.long_name
                            break
                    }
                })
            })

            const address = result.formatted_address
            const latitude = result.geometry.location.lat
            const longitude = result.geometry.location.lng
            const name = result.name
            const placeId = result.place_id
            const reference = result.reference

            const location = {
                lid, locality, administrativeAreaLevel1, administrativeAreaLevel2,
                country, address, latitude, longitude, name, placeId, reference
            }

            return models.Location.create(location)
        }
    })
}

/**
 * lid로 한 개의 location을 가져옵니다.
 * @param {*} lid lid
 */
exports.getItem = (lid) => {
    return models.Location.find({
        where: {
            lid
        }
    })
}

/**
 * placeId로 한 개의 location을 가져옵니다.
 * @param {*} placeId placeId
 */
exports.getItemByPlaceId = (placeId) => {
    return models.Location.find({
        where: {
            placeId
        }
    })
}