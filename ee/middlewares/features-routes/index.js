'use strict';

// eslint-disable-next-line node/no-extraneous-require
const { features } = require('siapi/lib/utils/ee');
const routes = require('./routes');

module.exports = siapi => ({
  beforeInitialize() {
    siapi.config.middleware.load.before.unshift('features-routes');
  },

  initialize() {
    loadFeaturesRoutes();
  },
});

const loadFeaturesRoutes = () => {
  for (const [feature, getFeatureRoutes] of Object.entries(routes)) {
    if (features.isEnabled(feature)) {
      siapi.admin.config.routes.push(...getFeatureRoutes);
    }
  }
};
