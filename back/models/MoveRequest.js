const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MoveRequest extends Model {
        static associate(Users, PriceProposal) {
            this.belongsTo(Users, { foreignKey: 'UserID' });
            this.belongsTo(PriceProposal, { foreignKey: 'RequestID' });
            this.hasMany(MoveRequestItems, { foreignKey: 'MoveRequestID' });
        }
    };
    MoveRequest.init({
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
        UserID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        moveStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        RequestItemID: {
            type: DataTypes.ARRAY(DataTypes.UUID),
          },
        moveDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        moveTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        moveFrom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        moveTo: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'MoveRequest',
    });
    return MoveRequest;
}