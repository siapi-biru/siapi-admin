'use strict';

const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { getAbsoluteAdminUrl } = require('siapi-utils');

/**
 * hashes a password
 * @param {string} password - password to hash
 * @returns {string} hashed password
 */
const hashPassword = password => bcrypt.hash(password, 10);

/**
 * Validate a password
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} is the password valid
 */
const validatePassword = (password, hash) => bcrypt.compare(password, hash);

/**
 * Check login credentials
 * @param {Object} options
 * @param {string} options.email
 * @param {string} options.password
 */
const checkCredentials = async ({ email, password }) => {
  const user = await siapi.query('user', 'admin').findOne({ email });

  if (!user || !user.password) {
    return [null, false, { message: 'Invalid credentials' }];
  }

  const isValid = await validatePassword(password, user.password);

  if (!isValid) {
    return [null, false, { message: 'Invalid credentials' }];
  }

  if (!(user.isActive === true)) {
    return [null, false, { message: 'User not active' }];
  }

  return [null, user];
};

/**
 * Send an email to the user if it exists or do nothing
 * @param {Object} param params
 * @param {string} param.email user email for which to reset the password
 */
const forgotPassword = async ({ email } = {}) => {
  const user = await siapi.query('user', 'admin').findOne({ email, isActive: true });

  if (!user) {
    return;
  }

  const resetPasswordToken = siapi.admin.services.token.createToken();
  await siapi.admin.services.user.updateById(user.id, { resetPasswordToken });

  // Send an email to the admin.
  const url = `${getAbsoluteAdminUrl(
    siapi.config
  )}/auth/reset-password?code=${resetPasswordToken}`;
  return siapi.plugins.email.services.email
    .sendTemplatedEmail(
      {
        to: user.email,
        from: siapi.config.get('server.admin.forgotPassword.from'),
        replyTo: siapi.config.get('server.admin.forgotPassword.replyTo'),
      },
      siapi.config.get('server.admin.forgotPassword.emailTemplate'),
      {
        url,
        user: _.pick(user, ['email', 'firstname', 'lastname', 'username']),
      }
    )
    .catch(err => {
      // log error server side but do not disclose it to the user to avoid leaking informations
      siapi.log.error(err);
    });
};

/**
 * Reset a user password
 * @param {Object} param params
 * @param {string} param.resetPasswordToken token generated to request a password reset
 * @param {string} param.password new user password
 */
const resetPassword = async ({ resetPasswordToken, password } = {}) => {
  const matchingUser = await siapi
    .query('user', 'admin')
    .findOne({ resetPasswordToken, isActive: true });

  if (!matchingUser) {
    throw siapi.errors.badRequest();
  }

  return siapi.admin.services.user.updateById(matchingUser.id, {
    password,
    resetPasswordToken: null,
  });
};

module.exports = {
  checkCredentials,
  validatePassword,
  hashPassword,
  forgotPassword,
  resetPassword,
};
