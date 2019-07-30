import dotenv from 'dotenv';

dotenv.config();
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  user: process.env.SENDGRID_USERNAME,
  pass:  process.env.SENDGRID_PASSWORD,
  mongoLink: () => {
    return process.env.NODE_ENV === 'test'
      ? 'mongodb://localhost/write-it-node-test'
      : 'mongodb://localhost/write-it-node';
  }
};

export default config;
