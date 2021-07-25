'use strict';

const sendDidInviteUser = async () => {
  const numberOfUsers = await siapi.admin.services.user.count();
  const numberOfRoles = await siapi.admin.services.role.count();
  return siapi.telemetry.send('didInviteUser', { numberOfRoles, numberOfUsers });
};

const sendDidUpdateRolePermissions = async () => {
  return siapi.telemetry.send('didUpdateRolePermissions');
};

module.exports = {
  sendDidInviteUser,
  sendDidUpdateRolePermissions,
};
