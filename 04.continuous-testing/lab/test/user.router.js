const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')


chai.use(chaiHttp)


describe('User REST API', () => {
  
    beforeEach(() => {
      // Clean DB before each test
      db.flushdb()
    })
    
    after(() => {
      app.close()
      db.quit()
    })


  describe('POST /user', () => {


    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201)
          chai.expect(res.body.status).to.equal('success')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
    
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
  })


  describe('GET /user', ()=> {
    // TODO Create test for the get method
    
    it('get an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      // First create a user
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201)
          
          // Then get the user
          chai.request(app)
            .get('/user/' + user.username)
            .then((res) => {
              chai.expect(res).to.have.status(200)
              chai.expect(res).to.be.json
              chai.expect(res.body.status).to.equal('success')
              chai.expect(res.body.user.username).to.equal('sergkudinov')
              chai.expect(res.body.user.firstname).to.equal('Sergei')
              chai.expect(res.body.user.lastname).to.equal('Kudinov')
              done()
            })
            .catch((err) => {
              throw err
            })
        })
        .catch((err) => {
          throw err
        })
    })
    
    it('cannot get a user that does not exist', (done) => {
      chai.request(app)
        .get('/user/invaliduser')
        .then((res) => {
          chai.expect(res).to.have.status(404)
          chai.expect(res).to.be.json
          chai.expect(res.body.status).to.equal('error')
          done()
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
