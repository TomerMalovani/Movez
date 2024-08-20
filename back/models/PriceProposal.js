'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PriceProposal extends Model {
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: 'MoverID' });
      this.belongsTo(models.Users, { foreignKey: 'MovingID' });
      this.belongsTo(models.MoveRequest, { foreignKey: 'RequestID', as: 'request' });
      this.belongsTo(models.VehicleInfo, { foreignKey: 'VehicleUUID', as: 'vehicle' }); // Associate Vehicle
    }
  }

  PriceProposal.init({
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
    VehicleUUID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
        notEmpty: true
      }
    },
    PriceOffer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        notEmpty: true
      }
    },
    PriceStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'PriceProposal',
  });

  return PriceProposal;
};
