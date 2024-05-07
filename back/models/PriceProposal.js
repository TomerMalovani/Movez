const { Model } = require('sequelize');
const MoveRequest = require('./MoveRequest');
module.exports = (sequelize, DataTypes) => {
    class PriceProposal extends Model {
        static associate(Users) {
            this.belongsTo(Users, { foreignKey: 'MoverID' });
            this.belongsTo(Users, { foreignKey: 'MovingID' });
            this.hasOne(MoveRequest, { foreignKey: 'RequestID' })
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
            allowNull: false
        },
        MoverID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        MovingID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        EstimatedCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'PriceProposal',
    });
    return PriceProposal;
}