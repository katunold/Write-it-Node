const crypto = require('crypto');
const Token = require('../models/tokenVerification.model');
const nodemailer = require('nodemailer');

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
    // send the email
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'katunold', // process.env.SENDGRID_USERNAME
        pass:  'Arnkat12@sendgrid'//process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      from: 'no-reply@write-it.com',
      to: user.email,
      subject: 'Account Verification Token',
      text: `
        Hello, 
        \n\n Please verify your account by clicking the link: 
        \n http://${req.headers.host}/confirmation/${token.token} \n
        `
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      return res.status(201).send({
        message: 'Successfully signed up',
        accountVerification: `A verification email has been sent to ${user.email}`
      });
    });
  });
};

module.exports = emailVerify;
