const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VehicleInfo extends Model {
        static associate(Users) {
            this.belongsTo(Users, { foreignKey: 'MoverID' });
        }
    };
    VehicleInfo.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        MoverID: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                isUUID: 4,
                notEmpty: true
            }
        },
        VehicleType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Depth: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true,
                notEmpty: true
            }
        },
        Width: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true,
                notEmpty: true
            }
          },
          Height: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true,
                notEmpty: true
            }
          },
    }, {
        sequelize,
        modelName: 'VehicleInfo',
    });
    return VehicleInfo;
}