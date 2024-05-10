const { Model } = require('sequelize');
const MoveRequest = require('./MoveRequest');
module.exports = (sequelize, DataTypes) => {
    class PriceProposal extends Model {
        static associate(models) {
            this.belongsTo(models.Users, { foreignKey: 'MoverID' });
            this.belongsTo(models.Users, { foreignKey: 'MovingID' });
            this.hasOne(models.MoveRequest, { foreignKey: 'RequestID' })
        }
    };
    PriceProposal.init({
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
        },
    }, {
        sequelize,
        modelName: 'PriceProposal',
    });
    return PriceProposal;
}