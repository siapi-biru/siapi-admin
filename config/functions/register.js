'use strict';

const permissionsFieldsToPropertiesMigration = require('../migrations/permissions-fields-to-properties');

module.exports = () => {
  siapi.db.migrations.register(permissionsFieldsToPropertiesMigration);
};
