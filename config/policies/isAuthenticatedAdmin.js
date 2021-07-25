'use strict';

module.exports = (ctx, next) => {
  if (!ctx.state.isAuthenticatedAdmin) {
    throw siapi.errors.forbidden();
  }

  return next();
};
