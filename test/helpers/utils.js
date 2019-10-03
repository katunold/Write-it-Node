require('should');
const nodemailerMock = require('nodemailer-mock');

// const app = require('../../src/index');
import app from '../../src/index';

process.env.ENV = 'Test';

import User from '../../src/models/user.model';
import Token from '../../src/models/tokenVerification.model';
// const agent = request.agent(app);

// exports.signUp = (data) => {
//   return agent.post('/api/users')
//     .send(data);
// };

exports.useInTests = () => {

  afterEach((done) => {
    User.deleteMany({}).exec();
    Token.deleteMany({}).exec();
    // Reset the mock back to the defaults after each test
    // nodemailerMock.mock.reset();
    done();
  });

  after((done) => {
    // Remove our mocked nodemailer and disable mockery
    app.server.close(done());
  })
};
