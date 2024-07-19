'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoveRequestItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MoveRequestItems.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
  },
  MoveRequestID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
          isUUID: 4,
          notEmpty: true
      }
  },
  ItemDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
          notEmpty: true
      }
  },
  Height: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
          notEmpty: true,
          isNumeric: true
      }
  },
  Width: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
          notEmpty: true,
          isNumeric: true
      }
  },
  Depth: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
          notEmpty: true,
          isNumeric: true
      }
  },
  Weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
          notEmpty: true,
          isNumeric: true
      }
  },
  Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          notEmpty: true,
          isNumeric: true
      }
  },
  SpecialInstructions: {
      type: DataTypes.TEXT,
  },
  PhotoUrl:{
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
        isUrl: true
    }
  }
  }, {
    sequelize,
    modelName: 'MoveRequestItems',
  });
  return MoveRequestItems;
};