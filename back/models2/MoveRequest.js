const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MoveRequest extends Model {
      static associate(models) {
        MoveRequest.belongsTo(models.Users, { foreignKey: 'UserID' });
        MoveRequest.belongsTo(models.PriceProposal, { foreignKey: 'RequestID' });
        MoveRequest.hasMany(models.MoveRequestItems, { foreignKey: 'MoveRequestID' });
      }
    };
    MoveRequest.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
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
  