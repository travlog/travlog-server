const models = require('../models')
const uuidv1 = require('uuid/v1')
const bcrypt = require('bcryptjs')

/**
 * uid를 생성합니다.
 * @return {uid} uid
 */
function generateUid() {
    const uid = `u_${uuidv1()}`

    return models.user.find({
        attributes: ['uid'],
        where: {
            uid
        }
    }).then(result => {
        if (!result) {
            return uid
        } else {
            return generateUid()
        }
    })
}

/**
 * userId 를 생성합니다.
 * @return {userId} userId
 */
function generateUserId() {
    var userId = new Date().getTime().toString()

    return models.user.find({
        attributes: ['userId'],
        where: {
            userId
        }
    }).then(result => {
        if (!result) {
            return userId
        } else {
            return generateUserId()
        }
    })
}

/**
 * 새로운 User를 생성합니다.
 * @param {*} user 
 */
exports.createUser = async (user) => {
    const uid = await generateUid()

    if (!user.userId) {
        user.userId = await generateUserId()
    }

    let encryptedPassword
    if (user.password) {
        const salt = bcrypt.genSaltSync(10)
        encryptedPassword = bcrypt.hashSync(user.password, salt)
    }

    return models.user.create({
        uid,
        userId: user.userId,
        password: encryptedPassword,
        name: user.name,
        profilePicture: user.profilePicture
    })
}

/**
 * Account를 생성합니다.
 * @param {*} account 
 */
exports.createAccount = (account) => {
    return models.account.create(account)
}

/**
 * userId가 일치하는 Account에 연결 된 한 개의 User를 가져옵니다.
 * @param {*} userId 
 */
exports.getUserByUserId = (userId) => {
    return models.user.find({
        attributes: ['uid', 'userId', 'name', 'username', 'profilePicture'],
        include: [{
            model: models.account,
            where: {
                userId: userId,
                isDrop: false
            }
        }]
    })
}

/**
 * userId와 provider가 일치하는 Account에 연결 된 한 개의 User를 가져옵니다.
 * @param {*} userId 
 * @param {*} provider 
 */
exports.getUserByUserIdAndProvider = (userId, provider) => {
    console.log('getUserByUserIdAndProvider: ')
    return models.user.find({
        attributes: ['uid', 'userId', 'name', 'username', 'profilePicture'],
        include: [{
            model: models.account,
            where: {
                userId: userId,
                provider: provider,
                isDrop: false
            }
        }]
    })
}

/**
 * userId가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} userId 
 * @return {*} account
 */
exports.getAccountByUserId = (userId) => {
    return models.account.find({
        attributes: ['userId', 'provider'],
        where: {
            userId, userId,
            isDrop: false
        }
    })
}

/**
 * email과 provider가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} email 
 * @param {*} provider 
 */
exports.getAccountByEmail = (email, provider) => {
    return models.account.find({
        where: {
            email: email,
            provider: provider,
            isDrop: false
        }
    })
};

/**
 * userId와 provider가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} userId 
 * @param {*} provider 
 */
exports.checkSnsAccountDuplicated = (userId, provider) => {
    return models.account.find({
        where: {
            userId: userId,
            provider: provider,
            isDrop: false
        }
    })
}

/**
 * email과 password가 일치하는 한 개의 User를 가져옵니다.
 * @param {*} email 
 * @param {*} password 
 * @return {*} user
 */
async function getUserByEmailAndPassword(email, password) {
    console.log('getUserByEmailAndPassword: ')
    let user = await models.user.find({
        attributes: ['uid', 'userId', 'name', 'username', 'profilePicture', 'password'],
        where: {
            isDrop: false
        },
        include: [
            {
                model: models.account,
                where: {
                    email,
                    provider: 'travlog',
                    isDrop: false
                }
            }
        ]
    });

    const isCorrectPassword = bcrypt.compareSync(password, user.password)
    return isCorrectPassword ? user : undefined;
}

/**
 * username과 password가 일치하는 한 개의 User를 가져옵니다.
 * @param {*} username 
 * @param {*} password 
 * @return {*} user
 */
function getUserByUsernameAndPassword(username, password) {
    console.log('getUserByUsernameAndPassword: ')
    return models.user.find({
        attributes: ['uid', 'userId', 'name', 'username', 'profilePicture'],
        where: {
            username: username,
            password: password,
            isDrop: false
        }
    })
}

/**
 * username을 업데이트합니다.
 * @param {*} userId 
 * @param {*} username 
 */
exports.updateUsername = (userId, username) => {
    console.log('updateUsername: ' + userId + ', ' + username)

    return models.user.update({
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

/**
 * username이 일치하는 한 개의 User를 가져옵니다.
 * @param {*} username 
 */
exports.getUserByUsername = (username) => {
    return models.user.find({
        attributes: ['uid', 'name', 'username', 'profilePicture'],
        where: {
            username: username,
            isDrop: false
        }
    })
}

/**
 * User에 연결 된 Account를 여러개 가져옵니다.
 * @param {*} uid 
 */
exports.getLinkedAccounts = (uid) => {
    return models.account.findAll({
        attributes: ['userId', 'email', 'name', 'profilePicture', 'provider'],
        where: {
            uid,
            isDrop: false
        }
    })
}

exports.updateUserId = (uid, userId) => {
    return models.user.update({
        userId
    },
        {
            where: {
                uid,
                isDrop: false
            }
        })
}

exports.getUserByLoginIdAndPassword = async (loginId, password) => {
    console.log('getUserByLoginIdAndPassword: ')
    let user = await getUserByEmailAndPassword(loginId, password)

    if (!user) {
        user = await getUserByUsernameAndPassword(loginId, password)
    }

    return user
}