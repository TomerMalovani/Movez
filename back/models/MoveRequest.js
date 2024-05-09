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
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                isTime: true,
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
}