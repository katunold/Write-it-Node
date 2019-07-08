const express = require('express');
const authController = require('../controllers/auth.controllers');

const authRouter = express.Router();

authRouter.route('/auth/signin')
  .post(authController.login);

module.exports = authRouter;
