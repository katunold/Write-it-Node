const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'Secret key',
  mongoLink: () => {
    return process.env.ENV === 'Test'
      ? 'mongodb://localhost/write-it-node-test'
      : 'mongodb://localhost/write-it-node';
  }
};

module.exports = config;
