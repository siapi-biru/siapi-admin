'use strict';

const passport = require('koa-passport');
const { isFunction } = require('lodash/fp');

const createLocalStrategy = require('./passport/local-strategy');

const authEventsMapper = {
  onConnectionSuccess: 'admin.auth.success',
  onConnectionError: 'admin.auth.error',
};

const valueIsFunctionType = ([, value]) => isFunction(value);
const keyIsValidEventName = ([key]) => {
  return Object.keys(siapi.admin.services.passport.authEventsMapper).includes(key);
};

const getPassportStrategies = () => [createLocalStrategy(siapi)];

const registerAuthEvents = () => {
  const { events = {} } = siapi.config.get('server.admin.auth', {});
  const { authEventsMapper } = siapi.admin.services.passport;

  const eventList = Object.entries(events)
    .filter(keyIsValidEventName)
    .filter(valueIsFunctionType);

  for (const [eventName, handler] of eventList) {
    siapi.eventHub.on(authEventsMapper[eventName], handler);
  }
};

const init = () => {
  siapi.admin.services.passport
    .getPassportStrategies()
    .forEach(strategy => passport.use(strategy));

  registerAuthEvents();

  return passport.initialize();
};

module.exports = {
  init,
  getPassportStrategies,
  authEventsMapper,
};
