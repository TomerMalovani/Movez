'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.MoveRequest, { foreignKey: 'UserID' });
      this.hasMany(models.PriceProposal, { foreignKey: 'MoverID' });
      this.hasMany(models.PriceProposal, { foreignKey: 'MovingID' });
      this.hasMany(models.VehicleInfo, { foreignKey: 'MoverID' });
    }
  }
  Users.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
  },
  username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
          notEmpty: true
      }
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true,
          isEmail: true
      }
  },
  salt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
  },
  token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    },
    token_exp: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
          isDate: true,
          notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};