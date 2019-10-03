import app from '../src/index';
import chai from 'chai';
import sinon from "sinon";
import { useInTests } from './helpers/utils';
import chaihttp from 'chai-http';
import mockData from './helpers/mock-data';
import nodemailer from "nodemailer";
import User from "../src/models/user.model";

const expect = chai.expect;



chai.use(chaihttp);

describe('Sign-up route', function() {

    // this.timeout(6000);
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();

    });

    afterEach("Restore Functions", () => {
        sandbox.restore();
    });

    useInTests();

    it('should create new user account',function (done) {
        sandbox.stub(nodemailer, "createTransport").returns({
            sendMail: () => {
                return Promise.resolve({
                    message: "A link to reset your password has been sent"
                });
            }
        });

        // sandbox.replace(nodemailer, "createTransport", nodemailerTransStub);

        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData)
          .end(function (err, res) {
              console.log(err);
              console.log(res);
              expect(res).to.have.status(201);
              done();
          });

    });

    it('should mock', function (done) {
        // sandbox.stub(User, 'findOne').returns({message: 'This account is yet to be verified'});
        chai.request(app)
          .post('api/signin')
          .send({userName: "Arnold", password: "1qa2ws"})
          .end((err, res) => {
              console.log(res);
              console.log(err);
              done();
          });
    });

    xit('should return error message when an empty field is submitted', function (done) {
        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData1)
          .end(function (err, res) {
              expect(res).to.have.status(401);
          });
        done()
    });

    xit('should return error message when signup data is incomplete', function (done) {
        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData2)
          .end((err, res) => {
              expect(res).to.have.status(422);
          });
        done();
    });

    xit('should return error message when the user email already exists', function (done) {
        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData);
        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData)
          .end((err, res) => {
              expect(res).to.have.status(201);
          });
        done();
    });
});
