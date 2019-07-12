const express = require('express');
const userCtrl = require('../controllers/user.controller');
const validation = require('../helpers/validation');

const router = express.Router();
/**
 * route to handle user login
 */
router.route('/api/users')
  .post(validation('create'), userCtrl.create);

/**
 * route to request for password reset link
 */
router.route('/api/users/reset-password')
  .post(userCtrl.resetPassword);

/**
 * change password
 */
router.route('/reset/:token')
  .post(userCtrl.passwordUpate);

/**
 * route to resend the email confirmation link
 */
router.route('/api/users/resend')
  .post(userCtrl.resendVerificationToken);

/**
 * route to handle email confirmation
 */
router.route('/confirmation/:token')
  .get(userCtrl.emailConfirmation);

module.exports = router;
