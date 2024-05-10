'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PriceProposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'MoverID' });
      this.belongsTo(models.Users, { foreignKey: 'MovingID' });
      this.hasOne(models.MoveRequest, { foreignKey: 'RequestID' })
    }
  }
  PriceProposal.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
  },
  RequestID:{
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
          isUUID: 4,
          notEmpty: true
      }
  },
  MoverID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
          isUUID: 4,
          notEmpty: true
      }
  },
  MovingID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
          isUUID: 4,
          notEmpty: true
      }
  },
  EstimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
          isDecimal: true,
          notEmpty: true
      }
  }
  }, {
    sequelize,
    modelName: 'PriceProposal',
  });
  return PriceProposal;
};