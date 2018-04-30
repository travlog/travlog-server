const models = require('../models');
const express = require('express');
const router = express.Router();

function generateUserId(userId) {
    return models.User.find({
        attributes: ['userId'],
        where: {
            userId: userId
        }
    });
};

function createUser(user) {
    console.log('createUser: ' + JSON.stringify(user));

    return models.User.create({
        email: user.email,
        userId: user.userId,
        password: user.password,
        name: user.name
    });
};

function createAccount(account) {
    console.log('createAccount: ' + JSON.stringify(account));

    return models.Account.create({
        accessToken: account.accessToken,
        userId: account.userId,
        type: account.type
    })
};

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
        // TODO: 이메일 중복 확인
        // if (email.isDuplicated) {
        //      throw err;
        // } else {

        userId = new Date().getTime().toString();
        var result = await generateUserId(userId);

        if(result == null) {
            console.log('generateUserId result is null');
        } else {
            // generateUserId();
        }

        console.log('generated userId: ' + userId);

        type = 'travlog';

        user = await createUser({
            email: email,
            userId: userId,
            password: password,
            name: name
        });

        console.log('created user: ' + JSON.stringify(user));

        account = await createAccount({
            accessToken: 'accessToken',
            userId: userId,
            type: type
        });

        console.log('created account: ' + JSON.stringify(account));

        // }
    } else {
        // if(sns.isExist) {
        user = await getUser(userId);
        console.log('selected user: ' + JSON.stringify(user));
        account = user.Accounts[0];
        // } else {
        // }
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
