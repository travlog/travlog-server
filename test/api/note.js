const rq = require('request-promise-native')
const expect = require('chai').expect

describe('test note api', function() {
    this.timeout(10000)
    const baseUrl = "http://localhost:3000/api"

    const SUCCESS_CODE = 2000;
    let accessToken = "";

    before(async () => {
        try {
            const resSignIn = await rq.post({
                url : `${baseUrl}/signin`,
                json : {
                    "loginId": "rkd@gmail.com",
                    "password": "rkd123"
                }
            })

            if (resSignIn.codeno === SUCCESS_CODE) {
                accessToken = resSignIn.data.accessToken
            }

        } catch (e) {
            console.error(e)
        }

        expect(accessToken).to.not.equal("")

    });

    it('노트 생성', async () => {
        const resCreateNote = await rq.post({
            headers : {
                Authorization: `Bearer ${accessToken}`
            },
            url : `${baseUrl}/notes`,
            json : {
                "title":"title",
                "destination":{
                    "placeId":"ChIJzWXFYYuifDUR64Pq5LTtioU",
                    "startDate":"2018-05-23 15:39:41",
                    "endDate":"2018-05-27 15:39:41"
                }
            }
        })

        expect(resCreateNote.codeno).to.be.equal(SUCCESS_CODE)
        const createNote = resCreateNote.data

        const resGetNote = await rq.get({
            headers : {
                Authorization: `Bearer ${accessToken}`
            },
            url : `${baseUrl}/notes/${createNote.id}`,
            json : true
        })

        expect(resGetNote.codeno).to.be.equal(SUCCESS_CODE)
    })

})