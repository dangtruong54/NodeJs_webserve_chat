import chai from 'chai';
import chaiHttp from 'chai-http'
import app from '../index'
let should = chai.should()
app().listen(3000)
chai.use(chaiHttp)
console.log('Your server is running on port 3000')
let token = ''
let statusId = ''
describe('Test API', () => {
    before((done) => {
        process.env.UNITEST = 'true'
        done()
    });
    describe('/POST login', () => {
        it('it should send token when successfull', (done) => {
            chai.request(app())
                .post('/auth/login')
                .send({
                    email: process.env.EMAIL_LOGIN_TEST,
                    password: process.env.PASSWORD_LOGIN_TEST,
                })
                .end((errror, response) => {
                    response.should.have.status(200)
                    token = response.text
                    done()
                })
        });
    });
    describe('/POST status', () => {
        it('it should POST to create new status', (done) => {
            chai.request(app())
                .post('/status/new')
                .set('authorization', token)
                .send({
                    caption: "unitest insert new status",
                    time_up: Date.now(),
                    user_id: 'user_id_1'
                })
                .end((errror, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status_id')
                    statusId = response.body.status_id
                    done()
                })
        });
    });
    describe('/GET/:id status', () => {
        it('it should GET status by id', (done) => {
            chai.request(app())
                .get('/status/' + statusId)
                .end((errror, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('caption')
                    response.body.should.have.property('time_up')
                    response.body.should.have.property('user_id')
                    done()
                })
        });
    });
    describe('/POST comment', () => {
        it('it should POST to new comment on status', (done) => {
            chai.request(app())
                .post('/status/comment')
                .set('authorization', token)
                .send({
                    comment: "comment unitest",
                    user_id: "userid_1",
                    status_id: statusId
                })
                .end((errror, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('comment_id')
                    done()
                })
        });
    });
    describe('/POST message', () => {
        it('it should GET message on room', (done) => {
            chai.request(app())
                .post('/message/get')
                .set('authorization', token)
                .send({
                    room: "room_unitest_1"
                })
                .end((error, response) => {
                    response.should.status(200)
                    response.body.should.be.an('array')
                    done()
                })
        })
    })
    describe('/GET room', () => {
        it('it should GET available rooms', (done) => {
            chai.request(app())
                .get('/room/available')
                .set('authorization', token)
                .end((error, response) => {
                    response.should.status(200)
                    response.body.should.be.a('object')
                    done()
                })
        })
    })
    describe('/POST room', () => {
        it('it should join available rooms', (done) => {
            chai.request(app())
                .post('/room/join')
                .set('authorization', token)
                .send({
                    room: "room_1"
                })
                .end((error, response) => {
                    if (response.status == 200) {
                        response.body.should.be.a('object')
                        response.body.should.have.property('notice')
                    } else {
                        response.should.status(400)
                        response.body.should.be.a('object')
                        response.body.should.have.property('error')
                    }
                    done()
                })
        })
    })
    after((done) => {
        process.env.UNITEST = 'false'
        console.log('unitest done !')
        done()
        process.exit(0)
    });
});