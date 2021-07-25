'use strict';

const execa = require('execa');
const _ = require('lodash');

const PLUGIN_NAME_REGEX = /^[A-Za-z][A-Za-z0-9-_]+$/;

/**
 * Validates a plugin name format
 */
const isValidPluginName = plugin => {
  return _.isString(plugin) && !_.isEmpty(plugin) && PLUGIN_NAME_REGEX.test(plugin);
};

/**
 * A set of functions called "actions" for `Admin`
 */

module.exports = {
  async init() {
    const uuid = siapi.config.get('uuid', false);
    const hasAdmin = await siapi.admin.services.user.exists();

    return { data: { uuid, hasAdmin } };
  },

  async information() {
    const currentEnvironment = siapi.app.env;
    const autoReload = siapi.config.get('autoReload', false);
    const siapiVersion = siapi.config.get('info.siapi', null);
    const nodeVersion = process.version;
    const communityEdition = !siapi.EE;

    return {
      data: { currentEnvironment, autoReload, siapiVersion, nodeVersion, communityEdition },
    };
  },

  async installPlugin(ctx) {
    try {
      const { plugin } = ctx.request.body;

      if (!isValidPluginName(plugin)) {
        return ctx.badRequest('Invalid plugin name');
      }

      siapi.reload.isWatching = false;

      siapi.log.info(`Installing ${plugin}...`);
      await execa('npm', ['run', 'siapi', '--', 'install', plugin]);

      ctx.send({ ok: true });

      siapi.reload();
    } catch (err) {
      siapi.log.error(err);
      siapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async plugins(ctx) {
    try {
      const plugins = Object.keys(siapi.plugins).reduce((acc, key) => {
        acc[key] = _.get(siapi.plugins, [key, 'package', 'siapi'], {
          name: key,
        });

        return acc;
      }, {});

      ctx.send({ plugins });
    } catch (err) {
      siapi.log.error(err);
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },

  async uninstallPlugin(ctx) {
    try {
      const { plugin } = ctx.params;

      if (!isValidPluginName(plugin)) {
        return ctx.badRequest('Invalid plugin name');
      }

      siapi.reload.isWatching = false;

      siapi.log.info(`Uninstalling ${plugin}...`);
      await execa('npm', ['run', 'siapi', '--', 'uninstall', plugin, '-d']);

      ctx.send({ ok: true });

      siapi.reload();
    } catch (err) {
      siapi.log.error(err);
      siapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occurred' }] }]);
    }
  },
};
