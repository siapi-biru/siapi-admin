/* eslint-disable */

const injectReducer = require('./utils/injectReducer').default;
const useInjectReducer = require('./utils/injectReducer').useInjectReducer;
const injectSaga = require('./utils/injectSaga').default;
const useInjectSaga = require('./utils/injectSaga').useInjectSaga;
const { languages } = require('./i18n');

window.siapi = Object.assign(window.siapi || {}, {
  node: MODE || 'host',
  env: NODE_ENV,
  backendURL: BACKEND_URL === '/' ? window.location.origin : BACKEND_URL,
  languages,
  currentLanguage:
    window.localStorage.getItem('siapi-admin-language') ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    'en',
  injectReducer,
  injectSaga,
  useInjectReducer,
  useInjectSaga,
});

module.exports = {
  'siapi-plugin-documentation': require('../../../siapi-plugin-documentation/admin/src').default,
  'siapi-plugin-users-permissions': require('../../../siapi-plugin-users-permissions/admin/src')
    .default,
  'siapi-plugin-content-manager': require('../../../siapi-plugin-content-manager/admin/src')
    .default,
  'siapi-plugin-content-type-builder': require('../../../siapi-plugin-content-type-builder/admin/src')
    .default,
  'siapi-plugin-email': require('../../../siapi-plugin-email/admin/src').default,
  'siapi-plugin-upload': require('../../../siapi-plugin-upload/admin/src').default,
  'siapi-plugin-graphql': require('../../../siapi-plugin-graphql/admin/src').default,
  'siapi-plugin-i18n': require('../../../siapi-plugin-i18n/admin/src').default,
};
