'use strict';

const { Strategy: LocalStrategy } = require('passport-local');

const createLocalStrategy = siapi => {
  return new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    (email, password, done) => {
      return siapi.admin.services.auth
        .checkCredentials({ email, password })
        .then(([error, user, message]) => done(error, user, message))
        .catch(error => done(error));
    }
  );
};

module.exports = createLocalStrategy;
