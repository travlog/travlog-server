module.exports = {
    apps: [{
        name: 'travlog-api',
        script: './bin/www',
        env: {
            'NODE_ENV': 'development'
        },
        env_production: {
            'NODE_ENV': 'production'
        }
    }]
}
