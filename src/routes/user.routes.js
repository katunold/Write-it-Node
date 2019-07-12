const express = require('express');
const userCtrl = require('../controllers/user.controller');
const validation = require('../helpers/validation');

const router = express.Router();

router.route('/api/users')
  .post(validation('create'), userCtrl.create);

router.route('/api/users/resend')
  .post(userCtrl.resendVerificationToken);

router.route('/confirmation/:token')
  .get(userCtrl.emailConfirmation);

module.exports = router;
