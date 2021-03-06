module.exports = context => {
  const UserModel = context.app.service('users').Model;

  context.params.sequelize = {
    raw: false,
    include: [{ model: UserModel, attributes: ['id', 'email'] }]
  };
  return context;
};