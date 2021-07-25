/**
 *
 * app.js
 *
 * Entry point of the application
 */

// NOTE TO PLUGINS DEVELOPERS:
// If you modify this file by adding new options to a plugin entry point
// Here's the file: siapi/docs/3.0.0-beta.x/plugin-development/frontend-field-api.md
// Here's the file: siapi/docs/3.0.0-beta.x/guides/registering-a-field-in-admin.md
// Also the siapi-generate-plugins/files/admin/src/index.js needs to be updated
// IF THE DOC IS NOT UPDATED THE PULL REQUEST WILL NOT BE MERGED

/* eslint-disable */

import '@babel/polyfill';
import 'sanitize.css/sanitize.css';

// Third party css library needed
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.min.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// Siapi provider with the internal APIs
import { SiapiProvider } from 'siapi-helper-plugin';
import { merge } from 'lodash';
import Fonts from './components/Fonts';
import { freezeApp, pluginLoaded, unfreezeApp, updatePlugin } from './containers/App/actions';
import { showNotification } from './containers/NotificationProvider/actions';
import { showNotification as showNewNotification } from './containers/NewNotification/actions';

import basename from './utils/basename';
import injectReducer from './utils/injectReducer';
import injectSaga from './utils/injectSaga';
import Siapi from './utils/Siapi';

// Import root component
import App from './containers/App';
// Import Language provider
import LanguageProvider from './containers/LanguageProvider';

import configureStore from './configureStore';
import { SETTINGS_BASE_URL } from './config';

// Import i18n messages
import { translationMessages, languages } from './i18n';

import history from './utils/history';

import plugins from './plugins';

const siapi = Siapi();

const pluginsReducers = {};
const pluginsToLoad = [];

Object.keys(plugins).forEach(current => {
  const registerPlugin = plugin => {
    siapi.registerPlugin(plugin);

    return plugin;
  };
  const currentPluginFn = plugins[current];

  // By updating this by adding required methods
  // to load a plugin you need to update this file
  // siapi-generate-plugins/files/admin/src/index.js needs to be updated
  const plugin = currentPluginFn({
    registerComponent: siapi.componentApi.registerComponent,
    registerField: siapi.fieldApi.registerField,
    registerPlugin,
    settingsBaseURL: SETTINGS_BASE_URL || '/settings',
    middlewares: siapi.middlewares,
  });

  const pluginTradsPrefixed = languages.reduce((acc, lang) => {
    const currentLocale = plugin.trads[lang];

    if (currentLocale) {
      const localeprefixedWithPluginId = Object.keys(currentLocale).reduce((acc2, current) => {
        acc2[`${plugin.id}.${current}`] = currentLocale[current];

        return acc2;
      }, {});

      acc[lang] = localeprefixedWithPluginId;
    }

    return acc;
  }, {});

  // Retrieve all reducers
  const pluginReducers = plugin.reducers || {};

  Object.keys(pluginReducers).forEach(reducerName => {
    pluginsReducers[reducerName] = pluginReducers[reducerName];
  });

  try {
    merge(translationMessages, pluginTradsPrefixed);
    pluginsToLoad.push(plugin);
  } catch (err) {
    console.log({ err });
  }
});

const initialState = {};
const store = configureStore(initialState, pluginsReducers, siapi);
const { dispatch } = store;

// Load plugins, this will be removed in the v4, temporary fix until the plugin API
// https://plugin-api-rfc.vercel.app/plugin-api/admin.html
pluginsToLoad.forEach(plugin => {
  const bootPlugin = plugin.boot;

  if (bootPlugin) {
    bootPlugin(siapi);
  }

  dispatch(pluginLoaded(plugin));
});

// TODO
const remoteURL = (() => {
  // Relative URL (ex: /dashboard)
  if (REMOTE_URL[0] === '/') {
    return (window.location.origin + REMOTE_URL).replace(/\/$/, '');
  }

  return REMOTE_URL.replace(/\/$/, '');
})();

const displayNotification = (message, status) => {
  console.warn(
    // Validate the text
    'Deprecated: Will be deleted.\nPlease use siapi.notification.toggle(config).\nDocs : https://siapi.io/documentation/developer-docs/latest/development/local-plugins-customization.html#siapi-notification'
  );
  dispatch(showNotification(message, status));
};
const displayNewNotification = config => {
  dispatch(showNewNotification(config));
};
const lockApp = data => {
  dispatch(freezeApp(data));
};
const unlockApp = () => {
  dispatch(unfreezeApp());
};

const lockAppWithOverlay = () => {
  const overlayblockerParams = {
    children: <div />,
    noGradient: true,
  };

  lockApp(overlayblockerParams);
};

window.siapi = Object.assign(window.siapi || {}, {
  node: MODE || 'host',
  env: NODE_ENV,
  remoteURL,
  backendURL: BACKEND_URL === '/' ? window.location.origin : BACKEND_URL,
  notification: {
    // New notification api
    toggle: config => {
      displayNewNotification(config);
    },
    success: message => {
      displayNotification(message, 'success');
    },
    warning: message => {
      displayNotification(message, 'warning');
    },
    error: message => {
      displayNotification(message, 'error');
    },
    info: message => {
      displayNotification(message, 'info');
    },
  },
  refresh: pluginId => ({
    translationMessages: translationMessagesUpdated => {
      render(merge({}, translationMessages, translationMessagesUpdated));
    },
    leftMenuSections: leftMenuSectionsUpdated => {
      store.dispatch(updatePlugin(pluginId, 'leftMenuSections', leftMenuSectionsUpdated));
    },
  }),
  router: history,
  languages,
  currentLanguage:
    window.localStorage.getItem('siapi-admin-language') ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    'en',
  lockApp,
  lockAppWithOverlay,
  unlockApp,
  injectReducer,
  injectSaga,
  store,
});

const MOUNT_NODE = document.getElementById('app') || document.createElement('div');

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <SiapiProvider siapi={siapi}>
        <Fonts />
        <LanguageProvider messages={messages}>
          <BrowserRouter basename={basename}>
            <App store={store} />
          </BrowserRouter>
        </LanguageProvider>
      </SiapiProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  module.hot.accept(['./i18n', './containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);

    render(translationMessages);
  });
}

if (NODE_ENV !== 'test') {
  render(translationMessages);
}

// @Pierre Burgy exporting dispatch for the notifications...
export { dispatch };
