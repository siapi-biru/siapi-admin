import React from 'react';
import { CheckPagePermissions } from 'siapi-helper-plugin';
import adminPermissions from '../../../permissions';
import ListView from '../ListView';

const ProtectedListView = () => (
  <CheckPagePermissions permissions={adminPermissions.settings.webhooks.main}>
    <ListView />
  </CheckPagePermissions>
);

export default ProtectedListView;
