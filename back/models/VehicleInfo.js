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
            allowNull: false
        },
        VehicleType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Depth: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        Width: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          Height: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
    }, {
        sequelize,
        modelName: 'VehicleInfo',
    });
    return VehicleInfo;
}