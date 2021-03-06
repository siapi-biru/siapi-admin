'use strict';

const { yup, formatYupErrors } = require('siapi-utils');
// eslint-disable-next-line node/no-extraneous-require
const { features } = require('siapi/lib/utils/ee');

const handleReject = error => Promise.reject(formatYupErrors(error));

const roleCreateSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(1)
      .required(),
    description: yup.string().nullable(),
  })
  .noUnknown();

const rolesDeleteSchema = yup
  .object()
  .shape({
    ids: yup
      .array()
      .of(yup.siapiID())
      .min(1)
      .required()
      .test('roles-deletion-checks', 'Roles deletion checks have failed', async function(ids) {
        try {
          await siapi.admin.services.role.checkRolesIdForDeletion(ids);

          if (features.isEnabled('sso')) {
            await siapi.admin.services.role.ssoCheckRolesIdForDeletion(ids);
          }
        } catch (e) {
          return this.createError({ path: 'ids', message: e.message });
        }

        return true;
      }),
  })
  .noUnknown();

const roleDeleteSchema = yup
  .siapiID()
  .required()
  .test('no-admin-single-delete', 'Role deletion checks have failed', async function(id) {
    try {
      await siapi.admin.services.role.checkRolesIdForDeletion([id]);

      if (features.isEnabled('sso')) {
        await siapi.admin.services.role.ssoCheckRolesIdForDeletion([id]);
      }
    } catch (e) {
      return this.createError({ path: 'id', message: e.message });
    }

    return true;
  });

const validateRoleCreateInput = async data => {
  return roleCreateSchema.validate(data, { strict: true, abortEarly: false }).catch(handleReject);
};

const validateRolesDeleteInput = async data => {
  return rolesDeleteSchema.validate(data, { strict: true, abortEarly: false }).catch(handleReject);
};

const validateRoleDeleteInput = async data => {
  return roleDeleteSchema.validate(data, { strict: true, abortEarly: false }).catch(handleReject);
};

module.exports = {
  validateRoleCreateInput,
  validateRolesDeleteInput,
  validateRoleDeleteInput,
};
