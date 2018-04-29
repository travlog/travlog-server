const models = require('../models');
const express = require('express');
const router = express.Router();

var generateUserId = () => {
    var userId = new Date().getTime();

    return new Promise((resolved, rejected) => {
        models.User.findAll({
            attributes: ['userId'],
            where: {
                userId: userId
            }
        }).then(users => {
            if(users.length > 0) {
                checkUserIdDuplicated();
            } else {
                resolved(userId);
            }
        });
    });
}

router.post('/signup', (req, res, next) => {
    var accessToken = req.body.accessToken;
    var userId = req.body.userId;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var type = req.body.type;

    new Promise((resolved, rejected) => {
        if (typeof userId == 'undefined') {
            // TODO: 이메일 중복 확인
            // if (email.isDuplicated) {
            //      throw err;
            // } else {
                generateUserId().then(results => {
                    userId = results;
                    type = 'travlog';

                    new Promise((resolved, rejected) => {
                        models.User.create({
                            email: email,
                            userId: userId,
                            password: password,
                            name: name
                        }).then((user) => {
                            models.Account.create({
                                accessToken: 'accessToken',
                                userId: userId,
                                type: type
                            }).then((account) => {
                                var resUser = {
                                    userId: user.userId,
                                    name: user.name
                                }
                                var response = {
                                    user: resUser,
                                    accessToken: account.accessToken
                                }

                                resolved(response);
                            });
                        });
                    }).then(results => {
                        resolved(results);
                    });
                 });
            // }
        } else {
            // if(sns.isExist) {
                models.User.find({
                    attributes: ['userId', 'name'],
                    include: [{
                        model: models.Account,
                        where: {
                            userId: userId
                        }
                    }]
                }).then(user => {
                    resolved({
                        accessToken: user.Accounts[0].accessToken,
                        user: {
                            userId: user.userId,
                            name: user.name
                        }
                   });
                });
            // } else {
            // }

        }
    }).then(results => {
        console.log('results: '+JSON.stringify(results));
        res.json(results);
    });
})


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

module.exports = router
