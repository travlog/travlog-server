const models = require('../models')
const uuidv1 = require('uuid/v1')
const bcrypt = require('bcryptjs')
const PROVIDER_ENUM = [
    "travlog",
    "facebook",
    "google"
]

/**
 * email과 password가 일치하는 한 개의 User를 가져옵니다.
 * @param {*} email
 * @param {*} password
 * @return {*} user
 */
async function getUserByEmailAndPassword(email, password) {
    console.log('getUserByEmailAndPassword: ')
    let user = await models.user.findOne({
        "accounts.email": email,
        "accounts.provider": PROVIDER_ENUM[0],
        isDrop: false
    }, 'id userId name username profilePicture password accounts').lean().exec()

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
 * email 한 개의 User를 가져옵니다.
 * @param {*} email
 * @return {*} user
 */
async function getUserByLoginId(email) {
    return await models.user.findOne({
        "accounts.email": email,
        "accounts.provider": PROVIDER_ENUM[0],
        isDrop: false
    }, 'id userId name username profilePicture password accounts').lean().exec()
}


/**
 * id를 생성합니다.
 * @return {id} id
 */
function generateId() {
    const id = `u_${uuidv1()}`

    return models.user.findOne({ id }, "id").lean().exec()
        .then(result => {
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
    const userId = new Date().getTime().toString()

    return models.user.findOne({ userId }, "userId")
        .then(result => {
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
exports.createAccount = async (account) => {
    if (!account.provider || !PROVIDER_ENUM.includes(account.provider)) throw new Error('invalid account.provider')

    await checkExistAccount(account);

    if (!account.userId || account.userId === "")
        account.userId = await generateUserId()

    await models.user.update({ id: account.uid }, { $push: { accounts: account } })
    return account
}

/**
 * userId가 일치하는 Account에 연결 된 한 개의 User를 가져옵니다.
 * @param {*} userId 
 */
exports.getUserByUserId = (userId) => {
    return models.user.findOne({
        "accounts.userId": userId,
        isDrop: false
    }, "id userId name username profilePicture accounts").lean().exec()
}

/**
 * loginId(email)로 사용자를 가져옵니다.
 * @type {function(*)}
 */
exports.getUserByLoginId = getUserByLoginId

/**
 * userId와 provider가 일치하는 Account에 연결 된 한 개의 User를 가져옵니다.
 * @param {*} uid
 */
exports.getUserByUid = (uid) => {
    return models.user.findOne({
        id: uid, isDrop: false
    }).lean().exec()
}

/**
 * userId와 provider가 일치하는 한 개의 Account를 가져옵니다.
 * @param {*} userId 
 * @param {*} provider 
 */
exports.checkSnsAccountDuplicated = (userId, provider) => {
    return models.user.find({
        'accounts.userId': userId,
        'accounts.provider': provider,
        'accounts.isDrop': false
    }).exec()
}

/**
 * username을 업데이트합니다.
 * @param {*} userId 
 * @param {*} username 
 */
exports.updateUsername = (userId, username) => {
    console.log('updateUsername: ' + userId + ', ' + username)

    return models.user.update(
        { userId },
        { $set: { username: username } }
    )
}

/**
 * username이 일치하는 한 개의 User를 가져옵니다.
 * @param {*} username 
 */
exports.getUserByUsername = (username) => {
    return models.user.find({
        username: username,
        isDrop: false
    }, 'id name username profilePicture accounts').lean().exec()
}

/**
 * User에 연결 된 Account를 여러개 가져옵니다.
 * @param {*} id
 */
exports.getLinkedAccounts = (id) => {
    return models.user.find({
        id,
        isDrop: false
    }, 'accounts').exec()
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

exports.getUserByLoginIdAndPassword = async (loginId, password) => {
    console.log('getUserByLoginIdAndPassword: ')
    let user = await getUserByEmailAndPassword(loginId, password)

    if (!user) {
        user = await getUserByUsernameAndPassword(loginId, password)
    }

    return user
}

/**
 * 이미 연동된 account 인지 체크
 * @param account
 * @returns {Promise<void>}
 */
async function checkExistAccount(account) {
    if (account.provider === "travlog") {
        const linkedUserList = await models.user.find({
            "accounts.email": account.email,
            "accounts.provider": account.provider
        }).lean().exec()

        if (linkedUserList.length > 0)
            throw new Error(`already exist account(${JSON.stringify(account)})`)
    } else {
        const linkedUserList = await models.user.find({ "accounts.userId": account.userId }).lean().exec()

        if (linkedUserList.length > 0)
            throw new Error(`already exist account(${JSON.stringify(account)})`)
    }
}