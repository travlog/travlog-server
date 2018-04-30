const models = require('../models');
const express = require('express');
const router = express.Router();

// User.userId 중복 검사
function generateUserId() {
    var userId = new Date().getTime().toString();

    return models.User.find({
        attributes: ['userId'],
        where: {
            userId: userId
        }
    }).then(result => {
        if (result == null) {
            return userId;
        } else {
            generateUserId(new Date().getTime().toString());
        }
    });
};

// Create User
function createUser(user) {
    console.log('createUser: ' + JSON.stringify(user));

    return models.User.create({
        userId: user.userId,
        password: user.password,
        name: user.name
    });
};

// Create Account
function createAccount(account) {
    console.log('createAccount: ' + JSON.stringify(account));

    return models.Account.create({
        accessToken: account.accessToken,
        email: account.email,
        userId: account.userId,
        type: account.type
    })
};

// Select User
function getUser(userId) {
    return models.User.find({
        attributes: ['userId', 'name'],
        include: [{
            model: models.Account,
            where: {
                userId: userId
            }
        }]
    });
};

// 이메일 계정 중복 검사
function checkEmailAccountDuplicated(email) {
    return models.Account.find({
        where: {
            email: email,
            type: 'travlog',
            isDrop: false
        }
    })
};

// SNS 계정 중복 검사
function checkSnsAccountDuplicated(userId, type) {
    return models.Account.find({
        where: {
            userId: userId,
            type: type,
            isDrop: false
        }
    })
}

router.post('/signup', async (req, res, next) => {
    var accessToken = req.body.accessToken;
    var userId = req.body.userId;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var type = req.body.type;

    var user;
    var account;

    if (typeof userId == 'undefined') {

        // 이메일 회원 가입
        if (await checkEmailAccountDuplicated(email) != null) {

            // 이메일 중복
            res.status(422).json({
                code: 422,
                msg: 'Email already exists.'
            });
            return;
        } else {
            userId = await generateUserId();

            console.log('generated userId: ' + userId);

            type = 'travlog';

            user = await createUser({
                userId: userId,
                password: password,
                name: name
            });

            console.log('created user: ' + JSON.stringify(user));

            account = await createAccount({
                accessToken: 'accessToken',
                email: email,
                userId: userId,
                type: type
            });

            console.log('created account: ' + JSON.stringify(account));

        }
    } else {

        // SNS 회원가입
        if (await checkSnsAccountDuplicated(userId, type) != null) {

            // 로그인
            user = await getUser(userId);
            console.log('selected user: ' + JSON.stringify(user));
            account = user.Accounts[0];
        } else {

            // 가입
            user = await createUser({
                userId: userId,
                name: name
            });

            account = await createAccount({
                accessToken: 'accessToken',
                email: email,
                userId: userId,
                type: type
            });
        }
    }

    console.log('user: ' + JSON.stringify(user));

    res.json({
        user: {
            userId: user.userId,
            name: user.name
        },
        accessToken: account.accessToken
    });
});

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' })
})

module.exports = router
