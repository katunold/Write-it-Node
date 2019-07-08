const { body } = require('express-validator');

const validate = (method) => {
  if (method === 'create') {
    {
      return [
        body('email', 'Invalid email').exists().isEmail(),
        body('firstName', 'First Name is required').exists(),
        body('lastName', 'Last Name is required').exists(),
        body('userName', 'User Name is required').exists(),
        body('password', 'Password is required').exists(),
        body('password', 'Password must be atleast 6 characters').isLength({ min: 6 })
      ]
    }
  }
};

module.exports = validate;
