const express = require('express');
const router = express.Router();
const API = require('../lib/error')

const User = require('../db/user')

/* GET home page. */
router.get('/', (req, res, next) => {
    res.send(API.RESULT(API.CODE.SUCCESS, {
        hello: 'world'
    }))
})

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
        if (await User.checkEmailAccountDuplicated(email) != null) {

            // 이메일 중복
            res.status(422).json({
                code: 422,
                msg: 'Email already exists.'
            });
            return;
        } else {
            userId = await User.generateUserId();

            console.log('generated userId: ' + userId);

            type = 'travlog';

            user = await User.createUser({
                userId, password, name
            });

            console.log('created user: ' + JSON.stringify(user));

            account = await User.createAccount({
                accessToken: 'accessToken',
                email, userId, type
            });

            console.log('created account: ' + JSON.stringify(account));

        }
    } else {

        // SNS 회원가입
        if (await User.checkSnsAccountDuplicated(userId, type) != null) {

            // 로그인
            user = await User.getUser(userId);
            console.log('selected user: ' + JSON.stringify(user));
            account = user.Accounts[0];
        } else {

            // 가입
            user = await User.createUser({
                userId, name
            });

            account = await User.createAccount({
                accessToken: 'accessToken',
                email, userId, type
            });
        }
    }

    res.send(API.RESULT(API.CODE.SUCCESS, {
        user: {
            userId: user.userId,
            name: user.name
        },
        accessToken: account.accessToken
    }))
});

module.exports = router
