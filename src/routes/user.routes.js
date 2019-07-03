const express = require('express');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/api/users')
  .post(userCtrl.create);

router.route('/api/users/resend')
  .post(userCtrl.resendVerificationToken);

router.route('/confirmation/:token')
  .get(userCtrl.emailConfirmation);

module.exports = router;
