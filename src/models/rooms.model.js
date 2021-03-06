// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');

  const rooms = sequelizeClient.define('rooms', {
    roomCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomDesc: {
      type: DataTypes.STRING,
    },

    // style of voting for this room, either, 'single', 'random', 'truerandom',
    // or 'ranked'
    roomType: {
      type: DataTypes.STRING,
      defaultValue: 'single'
    },

    // For now state can be either, "starting", "voting", or "done". The state of a room is
    // set to "done" when all users are ready
    roomState: {
      type: DataTypes.STRING,
      allowNull: false
    },

    roomMax: {
      type: DataTypes.INTEGER,
      defaultValue: 15
    },

    // this field is set by the server after the last user ready 
    // it is a foreign key for a restaurant associated with this room
    selectedRestaurant: {
      type: DataTypes.STRING,
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // Define join table for RoomUsers
  const roomUsers = sequelizeClient.define('roomUsers', {
    admin: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  // eslint-disable-next-line no-unused-vars
  rooms.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    rooms.belongsToMany(models.users, { through: roomUsers });
    rooms.hasMany(models.votes);
    rooms.hasMany(models.restaurants);
    rooms.hasMany(models.messages);
    rooms.hasMany(models.ready);
  };

  return rooms;
};
