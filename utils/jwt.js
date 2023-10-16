const { promisify } = require('bluebird');
const jwt = require('jsonwebtoken');

module.exports = {
  sign: function (obj, secret) {
    return jwt.sign(obj, secret);
  },
  verify: promisify(jwt.verify),
};
