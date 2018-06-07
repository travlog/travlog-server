const models = require('../models')
const uuidv1 = require('uuid/v1')
const bcrypt = require('bcryptjs')

/**
 * id를 생성합니다.
 * @return {id} id
 */
function generateId() {
    const id = `u_${uuidv1()}`

    return models.user.findOne({
        attributes: ['id'],
        where: {
            id
        }
    }).lean().exec().then(result => {
        if (!result) {
            return id
        } else {
            return generateId()
        }
    })
}

/**
 * userId 를 생성합니다.
 * @return {userId} userId
 */
function generateUserId() {
    var userId = new Date().getTime().toString()

    return models.user.findOne({
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
    const id = await generateId()

    if (!user.userId) {
        user.userId = await generateUserId()
    }

    let encryptedPassword
    if (user.password) {
        const salt = bcrypt.genSaltSync(10)
        encryptedPassword = bcrypt.hashSync(user.password, salt)
    }

    return models.user.create({
        id,
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
    return models.user.findOne({
        attributes: ['id', 'userId', 'name', 'username', 'profilePicture'],
        include: [{
            model: models.account,
            where: {
                userId: userId,
                isDrop: false
            }
        }]
    }).exec()
}

/**
 * userId와 provider가 일치하는 Account에 연결 된 한 개의 User를 가져옵니다.
 * @param {*} userId 
 * @param {*} provider 
 */
exports.getUserByUserIdAndProvider = (uid, provider) => {
    // FIXME: account를 user의 내부 배열로 수정해야함
    return models.account.findOne({
        uid, provider, isDrop: false
    })
        .then(res => {
            return models.user.findOne({
                id: uid, isDrop: false
            })
        })
}

/**
 * userId가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} userId 
 * @return {*} account
 */
exports.getAccountByUserId = (userId) => {
    return models.account.findOne({
        attributes: ['userId', 'provider'],
        where: {
            userId, userId,
            isDrop: false
        }
    }).exec()
}

/**
 * userId가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} uid
 * @return {*} account
 */
exports.getAccountByUid = (uid) => {
    return models.account.findOne({
        uid,
        isDrop: false
    }, 'userId provider').exec()
}

/**
 * email과 provider가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} email 
 * @param {*} provider 
 */
exports.getAccountByEmail = (email, provider) => {
    return models.account.findOne({
        email: email,
        provider: provider,
        isDrop: false
    }).exec()
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
    }).exec()
}

/**
 * email과 password가 일치하는 한 개의 User를 가져옵니다.
 * @param {*} email 
 * @param {*} password 
 * @return {*} user
 */
async function getUserByEmailAndPassword(email, password) {
    console.log('getUserByEmailAndPassword: ')
    let account = await models.account.findOne({
        email,
        provider: 'travlog',
        isDrop: false
    }, 'id uid email provider isDrop')

    let user = await models.user.findOne({
        id: account.uid,
        isDrop: false

    }, 'id userId name username profilePicture password').exec()

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
        attributes: ['id', 'userId', 'name', 'username', 'profilePicture'],
        where: {
            username,
            password,
            isDrop: false
        }
    }).exec()
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
        attributes: ['id', 'name', 'username', 'profilePicture'],
        where: {
            username: username,
            isDrop: false
        }
    }).exec()
}

/**
 * User에 연결 된 Account를 여러개 가져옵니다.
 * @param {*} user.id 
 */
exports.getLinkedAccounts = (id) => {
    return models.account.findAll({
        attributes: ['userId', 'email', 'name', 'profilePicture', 'provider'],
        where: {
            id,
            isDrop: false
        }
    }).exec()
}

exports.updateUserId = (id, userId) => {
    return models.user.update({
        userId
    },
        {
            where: {
                id,
                isDrop: false
            }
        }).exec()
}

exports.getUserByLoginIdAndPassword = async (loginId, password) => {
    console.log('getUserByLoginIdAndPassword: ')
    let user = await getUserByEmailAndPassword(loginId, password)

    if (!user) {
        user = await getUserByUsernameAndPassword(loginId, password)
    }

    return user
}