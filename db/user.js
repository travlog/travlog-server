const models = require('../models')
const bcrypt = require('bcryptjs')

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
exports.createUser = async (user) => {
    console.log('createUser: ' + JSON.stringify(user))

    const salt = bcrypt.genSaltSync(10)
    const encryptedPassword = bcrypt.hashSync(user.password, salt)


    return models.User.create({
        userId: user.userId,
        password: encryptedPassword,
        name: user.name,
        profilePicture: user.profilePicture
    })
}

// Create Account
exports.createAccount = (account) => {
    console.log('createAccount: ' + JSON.stringify(account))

    return models.Account.create({
        email: account.email,
        userId: account.userId,
        provider: account.provider,
        name: account.name,
        profilePicture: account.profilePicture,
        u_id: account.u_id
    })
}

// Select User with userId
exports.getUserByUserId = (userId) => {
    return models.User.find({
        attributes: ['id', 'userId', 'name', 'username', 'profilePicture'],
        include: [{
            model: models.Account,
            where: {
                userId: userId,
                isDrop: false
            }
        }]
    })
}

exports.getUserByUserIdAndProvider = (userId, provider) => {
    return models.User.find({
        attributes: ['id', 'userId', 'name', 'username', 'profilePicture'],
        include: [{
            model: models.Account,
            where: {
                userId: userId,
                provider: provider,
                isDrop: false
            }
        }]
    })
}

// Select Account with userId
exports.getAccountByUserId = (userId) => {
    return models.Account.find({
        attributes: ['userId', 'provider'],
        where: {
            userId, userId,
            isDrop: false
        }
    })
}

// 이메일 계정 중복 검사
exports.getAccountByEmail = (email, provider) => {
    return models.Account.find({
        where: {
            email: email,
            provider: provider,
            isDrop: false
        }
    })
};

// SNS 계정 중복 검사
exports.checkSnsAccountDuplicated = (userId, provider) => {
    return models.Account.find({
        where: {
            userId: userId,
            provider: provider,
            isDrop: false
        }
    })
}

// 이메일 계정 확인
exports.getUserByEmailAndPassword = async (email, password) => {
    let user = await models.User.find({
        attributes: ['id', 'userId', 'name', 'username', 'profilePicture', 'password'],
        where: {
            isDrop: false
        },
        include: [
            {
                model: models.Account,
                where: {
                    email: email,
                    provider: 'travlog',
                    isDrop: false
                }
            }
        ]
    });

    const isCorrectPassword = bcrypt.compareSync(password, user.password)
    return isCorrectPassword ? user : undefined;
}

exports.getUserByUsernameAndPassword = (username, password) => {
    return models.User.find({
        attributes: ['id', 'userId', 'name', 'username', 'profilePicture'],
        where: {
            username: username,
            password: password,
            isDrop: false
        }
    })
}

exports.updateUsername = (userId, username) => {
    console.log('updateUsername: ' + userId + ', ' + username)

    return models.User.update({
        username: username
    },
        {
            where: {
                userId: userId,
                isDrop: false
            }
        }
    )
}

exports.getUserByUsername = (username) => {
    return models.User.find({
        attributes: ['id', 'name', 'username', 'profilePicture'],
        where: {
            username: username,
            isDrop: false
        }
    })
}

exports.getLinkedAccounts = (u_id) => {
    return models.Account.findAll({
        attributes: ['userId', 'email', 'name', 'profilePicture', 'provider'],
        where: {
            u_id: u_id,
            isDrop: false
        }
    })
}

exports.updateUserId = (id, userId) => {
    return models.User.update({
        userId: userId
    },
        {
            where: {
                id: id,
                isDrop: false
            }
        })
}
