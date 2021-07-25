'use strict';

const passport = require('koa-passport');

const utils = require('./utils');

const defaultConnectionError = () => new Error('Invalid connection payload');

const authenticate = async (ctx, next) => {
  const {
    params: { provider },
  } = ctx;
  const redirectUrls = utils.getPrefixedRedirectUrls();

  return passport.authenticate(provider, null, async (error, profile) => {
    if (error || !profile || !profile.email) {
      if (error) {
        siapi.log.error(error);
      }

      siapi.eventHub.emit('admin.auth.error', {
        error: error || defaultConnectionError(),
        provider,
      });

      return ctx.redirect(redirectUrls.error);
    }

    const user = await siapi.admin.services.user.findOne({ email: profile.email });
    const scenario = user ? existingUserScenario : nonExistingUserScenario;

    return scenario(ctx, next)(user || profile, provider);
  })(ctx, next);
};

const existingUserScenario = (ctx, next) => async (user, provider) => {
  const redirectUrls = utils.getPrefixedRedirectUrls();

  if (!user.isActive) {
    siapi.eventHub.emit('admin.auth.error', {
      error: new Error(`Deactivated user tried to login (${user.id})`),
      provider,
    });
    return ctx.redirect(redirectUrls.error);
  }

  ctx.state.user = user;
  return next();
};

const nonExistingUserScenario = (ctx, next) => async (profile, provider) => {
  const { email, firstname, lastname, username } = profile;
  const redirectUrls = utils.getPrefixedRedirectUrls();
  const adminStore = await utils.getAdminStore();
  const { providers } = await adminStore.get({ key: 'auth' });

  // We need at least the username or the firstname/lastname combination to register a new user
  const isMissingRegisterFields = !username && (!firstname || !lastname);

  if (!providers.autoRegister || !providers.defaultRole || isMissingRegisterFields) {
    siapi.eventHub.emit('admin.auth.error', { error: defaultConnectionError(), provider });
    return ctx.redirect(redirectUrls.error);
  }

  const defaultRole = await siapi.admin.services.role.findOne({ id: providers.defaultRole });

  // If the default role has been misconfigured, redirect with an error
  if (!defaultRole) {
    siapi.eventHub.emit('admin.auth.error', { error: defaultConnectionError(), provider });
    return ctx.redirect(redirectUrls.error);
  }

  // Register a new user with the information given by the provider and login with it
  ctx.state.user = await siapi.admin.services.user.create({
    email,
    username,
    firstname,
    lastname,
    roles: [defaultRole.id],
    isActive: true,
    registrationToken: null,
  });

  siapi.eventHub.emit('admin.auth.autoRegistration', {
    user: ctx.state.user,
    provider,
  });

  return next();
};

const redirectWithAuth = ctx => {
  const {
    params: { provider },
  } = ctx;
  const redirectUrls = utils.getPrefixedRedirectUrls();
  const { user } = ctx.state;

  const jwt = siapi.admin.services.token.createJwtToken(user);

  const isProduction = siapi.config.environment === 'production';

  const cookiesOptions = { httpOnly: false, secure: isProduction, overwrite: true };

  siapi.eventHub.emit('admin.auth.success', { user, provider });

  ctx.cookies.set('jwtToken', jwt, cookiesOptions);
  ctx.redirect(redirectUrls.success);
};

module.exports = {
  authenticate,
  redirectWithAuth,
};
