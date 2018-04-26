const dev = require('./dev')
const prod = require('./prod')

let config = null

if (process.env.NODE_ENV === 'development') {
    config = dev
} else if (process.env.NODE_ENV === 'production') {
    config = prod
} else {
    console.error('not found NODE_ENV')
    return
}

module.exports = config