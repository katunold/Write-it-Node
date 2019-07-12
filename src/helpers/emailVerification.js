const crypto = require('crypto');
const Token = require('../models/tokenVerification.model');
const nodemailer = require('nodemailer');
const config = require('../config/config');

const emailVerify = (user, req, res) => {
  // create a verification token for this user
  const token = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex')
  });

  // save verification token
  token.save(function (err) {
    if (err) {
      return err;
    }
    const subject = 'Account Verification Token';
    const body = `
        Hello, 
        \n\n Please verify your account by clicking the link: 
        \n http://${req.headers.host}/confirmation/${token.token} \n
        `;
    const mailOptions = mailOptionsData(req, user, token, subject, body);
    sendEmail(res, mailOptions, `A verification email has been sent to ${user.local.email}`);
  });
};

const passwordReset = (user, req, res) => {
  const token = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex')
  });

  token.save(function (err) {
    const subject = 'Write-it Password Reset';
    const body = `
        Hello, 
        \n\n Kindly copy this link to enable you reset your password: 
        \n http://${req.headers.host}/reset/${token.token} \n
        `;
    if (err) {
      return err;
    }

    const mailOptions = mailOptionsData(req, user, token, subject, body);
    sendEmail(res, mailOptions, `A link to reset your password has been sent to ${user.local.email}`);
  });
};

// send the email
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: config.user,
    pass:  config.pass
  }
});

const mailOptionsData = (req, user, token, subject, body) => {
  return {
    from: 'no-reply@write-it.com',
    to: user.local.email,
    subject,
    text: body
  }
};

const sendEmail = (res, mailOptions, message) => {
  return transporter.sendMail(mailOptions, function (err) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    return res.status(201).send({
      message
    });
  });
};

module.exports = { emailVerify, passwordReset};
