'use strict';

/**
 * Get unique error field
 */

const getUniqueErrorMessage = (err) => {
  let output;
  try {
    let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
  } catch (ex) {
    output = 'Unique field already exists'
  }

  return output
};

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
  let message = '';

  if (!err.code) {
    for (let errorName in err.errors) {
      const {message: message1} = err.errors[errorName];
      if (message1) message = message1
    }
  } else {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = 'Something went wrong'
    }
  }

  return message
};

module.exports = { getErrorMessage };
