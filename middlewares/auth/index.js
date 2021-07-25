'use strict';

module.exports = siapi => ({
  initialize() {
    const passportMiddleware = siapi.admin.services.passport.init();

    siapi.app.use(passportMiddleware);

    siapi.app.use(async (ctx, next) => {
      if (
        ctx.request.header.authorization &&
        ctx.request.header.authorization.split(' ')[0] === 'Bearer'
      ) {
        const token = ctx.request.header.authorization.split(' ')[1];

        const { payload, isValid } = siapi.admin.services.token.decodeJwtToken(token);

        if (isValid) {
          // request is made by an admin
          const admin = await siapi.query('user', 'admin').findOne({ id: payload.id }, ['roles']);

          if (!admin || !(admin.isActive === true)) {
            return ctx.forbidden('Invalid credentials');
          }

          ctx.state.admin = admin;
          ctx.state.user = admin;
          ctx.state.userAbility = await siapi.admin.services.permission.engine.generateUserAbility(
            admin
          );
          ctx.state.isAuthenticatedAdmin = true;
          return next();
        }
      }

      return next();
    });
  },
});
