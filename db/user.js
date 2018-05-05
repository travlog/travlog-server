const models = require('../models')

// User.userId 중복 검사
exports.generateUserId = () => {
    var userId = new Date().getTime().toString()

    return models.User.find({
        attributes: ['userId'],
        where: {
            userId: userId
        }
    }).then(result => {
        if (!result) {
            return userId
        } else {
            generateUserId(new Date().getTime().toString())
        }
    })
}

// Create User
exports.createUser = (user) => {
    console.log('createUser: ' + JSON.stringify(user))

    return models.User.create({
        userId: user.userId,
        password: user.password,
        name: user.name
    })
}

// Create Account
exports.createAccount = (account) => {
    console.log('createAccount: ' + JSON.stringify(account))

    return models.Account.create({
        email: account.email,
        userId: account.userId,
        type: account.type,
        name: account.name
    })
}

// Select User with userId
exports.getUserByUserId = (userId) => {
    return models.User.find({
        attributes: ['userId', 'name', 'username'],
        include: [{
            model: models.Account,
            where: {
                userId: userId
            }
        }]
    })
}

// Select Account with userId
exports.getAccountByUserId = (userId) => {
    return models.Account.find({
        attributes: ['userId', 'type'],
        where: {
            userId, userId
        }
    })
}

// 이메일 계정 중복 검사
exports.checkEmailAccountDuplicated = (email) => {
    return models.Account.find({
        where: {
            email: email,
            type: 'travlog',
            isDrop: false
        }
    })
};

// SNS 계정 중복 검사
exports.checkSnsAccountDuplicated = (userId, type) => {
    return models.Account.find({
        where: {
            userId: userId,
            type: type,
            isDrop: false
        }
    })
}

// 이메일 계정 확인
exports.getUserByEmailAndPassword = (email, password) => {
    return models.User.find({
        attributes: ['userId', 'name', 'username'],
        where: {
            password: password
        },
        include: [
            {
                model: models.Account,
                where: {
                    email: email,
                    type: 'travlog'
                }
            }
        ]
    })
}

exports.getUserByUsernameAndPassword = (username, password) => {
    return models.User.find({
        attributes: ['userId', 'name', 'username'],
        where: {
            username: username,
            password: password
        }
    })
}

exports.updateUsername = (userId, username) => {
    console.log('updateUsername: ' + userId + ', ' + username)

    return models.User.update(
        { username: username },
        { where: { userId: userId } }
    )
}

exports.getUserByUsername = (username) => {
    return models.User.find({
        attributes: ['name', 'username'],
        where: {
            username: username
        }
    })
}