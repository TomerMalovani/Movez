'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoveRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'UserID' });
      this.belongsTo(models.PriceProposal, { foreignKey: 'RequestID' });
      this.hasMany(models.MoveRequestItems, { foreignKey: 'MoveRequestID' });
    }
  }
  MoveRequest.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
        notEmpty: true
      }
    },
    moveStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    moveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    moveTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    moveFrom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    moveTo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
  }, {
    sequelize,
    modelName: 'MoveRequest',
  });
  return MoveRequest;
};