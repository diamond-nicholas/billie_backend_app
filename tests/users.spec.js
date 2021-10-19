const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const user = require('../mock/mockUser');

const url = 'api/v2/';

chai.use(chaiHttp);

describe('User can signup', () => {
  it('should reject empty request body', (done) => {
    const data = {};
    chai
      .request(app)
      .post(`${url}/users/create-user`)
      .send(data)
      .end((_request, response) => {
        response.should.have.property('status').equal(402);
        response.should.have.property('message').equal('No request body');
      });
    done();
  });
  it('should reject registered users', (done) => {
    const data = {
      id: '1',
      firstName: 'Dim',
      lastName: 'Nonso',
      email: 'dimnonso4life@gmail.com',
      password: '12345',
    };
    chai
      .request(app)
      .post(`${url}/users/create-user`)
      .send(data)
      .end((_request, response) => {
        response.should.have.property('status').equal(402);
        response.should.have
          .property('message')
          .equal('Already registered user');
      });
    done();
  });
  it('should register users', (done) => {
    const data = {
      firstName: 'Dim',
      lastName: 'Nonso',
      email: 'dimnonso4life@gmail.com',
      password: '12345',
    };
    chai
      .request(app)
      .post(`${url}/users/create-user`)
      .send(data)
      .end((_request, response) => {
        response.should.have.property('status').equal(201);
        response.should.have
          .property('message')
          .equal('Account created successfully');
      });
    done();
  });
});
describe('User can sign in', () => {
  it('should reject empty fields', (done) => {
    const login = {};
    chai
      .request(app)
      .post(`${url}/users/login`)
      .send(login)
      .end((_request, response) => {
        response.body.should.have.property('status').equal(422);
        response.body.should.have
          .property('message')
          .equal('No data in request body');
        response.body.message.should.be.an('Array');
      });
    done();
  });
  it('should reject invalid details', (done) => {
    const data = {
      email: user[1].email,
      password: user[1].password,
    };
    chai
      .request(app)
      .post(`${url}/users/login`)
      .send(data)
      .end((_request, response) => {
        response.body.should.have.property('status').equal(400);
        response.body.should.have
          .property('message')
          .equal('Invalid credentials');
      });
    done();
  });
  it('should successfully login if fields match specified criteria', (done) => {
    const data = {
      email: user[1].email,
      password: user[1].textPassword,
    };
    chai
      .request(app)
      .post(`${url}/users/login`)
      .send(data)
      .end((_request, response) => {
        response.body.should.have.property('status').equal(200);
        response.body.should.have
          .property('message')
          .equal('Successfully logged in');
        response.body.data.should.be.an('Object');
        response.body.data.should.have.property('token');
        response.body.data.should.have.property('userId');
      });
    done();
  });
});
describe('User can edit own account', () => {
  it('reject unauthorized unauthenticated users', (done) => {
    const userData = user[1];
    const token = 'efyyutghub';
    chai
      .request(app)
      .post(`${url}/users/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send(userData)
      .end((_request, response) => {
        response.body.should.have.property('status').equal(422);
        response.body.should.have
          .property('message')
          .equal('Unauthorized access');
      });
    done();
  });
});
