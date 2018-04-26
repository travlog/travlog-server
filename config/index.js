const dev = require('./dev')
const prod = require('./prod')

let config = null

if (process.env.NODE_ENV === 'develop') {
    config = dev
} else if (process.env.NODE_ENV === 'prod') {
    config = prod
} else {
    console.error('not found NODE_ENV')
    return
}

module.exports = config