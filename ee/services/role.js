'use strict';

const { toString } = require('lodash/fp');

const ssoCheckRolesIdForDeletion = async ids => {
  const adminStore = await siapi.store({ type: 'core', environment: '', name: 'admin' });
  const {
    providers: { defaultRole },
  } = await adminStore.get({ key: 'auth' });

  for (const roleId of ids) {
    if (defaultRole && toString(defaultRole) === toString(roleId)) {
      throw new Error(
        'This role is used as the default SSO role. Make sure to change this configuration before deleting the role'
      );
    }
  }
};

module.exports = {
  ssoCheckRolesIdForDeletion,
};
