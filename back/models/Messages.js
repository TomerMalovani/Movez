'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.MoveRequest, { foreignKey: 'RequestID' });
    }
  }
  Messages.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    RequestID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
          isUUID: 4,
          notEmpty: true
      }
    },
    FromName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
      }
    },
    Content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};