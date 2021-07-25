'use strict';

const _ = require('lodash');
const {
  validateUserCreationInput,
  validateUserUpdateInput,
  validateUsersDeleteInput,
} = require('../validation/user');

module.exports = {
  async create(ctx) {
    const { body } = ctx.request;

    try {
      await validateUserCreationInput(body);
    } catch (err) {
      return ctx.badRequest('ValidationError', err);
    }

    const attributes = _.pick(body, [
      'firstname',
      'lastname',
      'email',
      'roles',
      'preferedLanguage',
    ]);

    const userAlreadyExists = await siapi.admin.services.user.exists({
      email: attributes.email,
    });

    if (userAlreadyExists) {
      return ctx.badRequest('Email already taken');
    }

    const createdUser = await siapi.admin.services.user.create(attributes);

    const userInfo = siapi.admin.services.user.sanitizeUser(createdUser);

    // Send 201 created
    ctx.created({ data: userInfo });
  },

  async find(ctx) {
    const method = _.has(ctx.query, '_q') ? 'searchPage' : 'findPage';

    const { results, pagination } = await siapi.admin.services.user[method](ctx.query);

    ctx.body = {
      data: {
        results: results.map(siapi.admin.services.user.sanitizeUser),
        pagination,
      },
    };
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const user = await siapi.admin.services.user.findOne({ id });

    if (!user) {
      return ctx.notFound('User does not exist');
    }

    ctx.body = {
      data: siapi.admin.services.user.sanitizeUser(user),
    };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { body: input } = ctx.request;

    try {
      await validateUserUpdateInput(input);
    } catch (err) {
      return ctx.badRequest('ValidationError', err);
    }

    if (_.has(input, 'email')) {
      const uniqueEmailCheck = await siapi.admin.services.user.exists({
        id_ne: id,
        email: input.email,
      });

      if (uniqueEmailCheck) {
        return ctx.badRequest('A user with this email address already exists');
      }
    }

    const updatedUser = await siapi.admin.services.user.updateById(id, input);

    if (!updatedUser) {
      return ctx.notFound('User does not exist');
    }

    ctx.body = {
      data: siapi.admin.services.user.sanitizeUser(updatedUser),
    };
  },

  async deleteOne(ctx) {
    const { id } = ctx.params;

    const deletedUser = await siapi.admin.services.user.deleteById(id);

    if (!deletedUser) {
      return ctx.notFound('User not found');
    }

    return ctx.deleted({
      data: siapi.admin.services.user.sanitizeUser(deletedUser),
    });
  },

  /**
   * Delete several users
   * @param {KoaContext} ctx - koa context
   */
  async deleteMany(ctx) {
    const { body } = ctx.request;
    try {
      await validateUsersDeleteInput(body);
    } catch (err) {
      return ctx.badRequest('ValidationError', err);
    }

    const users = await siapi.admin.services.user.deleteByIds(body.ids);
    const sanitizedUsers = users.map(siapi.admin.services.user.sanitizeUser);

    return ctx.deleted({
      data: sanitizedUsers,
    });
  },
};
