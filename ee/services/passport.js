'use strict';

// eslint-disable-next-line node/no-extraneous-require
const { features } = require('siapi/lib/utils/ee');

const createLocalStrategy = require('../../services/passport/local-strategy');
const sso = require('./passport/sso');

const getPassportStrategies = () => {
  const localStrategy = createLocalStrategy(siapi);

  if (!features.isEnabled('sso')) {
    return [localStrategy];
  }

  if (!siapi.isLoaded) {
    sso.syncProviderRegistryWithConfig();
  }

  const providers = sso.providerRegistry.getAll();
  const strategies = providers.map(provider => provider.createStrategy(siapi));

  return [localStrategy, ...strategies];
};

module.exports = {
  getPassportStrategies,
};

if (features.isEnabled('sso')) {
  Object.assign(module.exports, sso);
}
