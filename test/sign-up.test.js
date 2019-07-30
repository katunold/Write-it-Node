import app from '../src/index';
import chai from 'chai';
import { useInTests } from './helpers/utils';
import chaihttp from 'chai-http';
import mockData from './helpers/mock-data';
const expect = chai.expect;



chai.use(chaihttp);

describe('Sign-up route', () => {

    useInTests();

    it('should create new user account',function (done) {
        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData)
          .end(function (err, res) {
              expect(res).to.have.status(201);
          });
        done();
    });

    it('should return error message', function (done) {
        chai.request(app)
          .post('/api/users')
          .send(mockData.signUpData1)
          .end(function (err, res) {
              expect(res).to.have.status(401);
          });
        done()
    });
});
