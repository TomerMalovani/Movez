const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MoveRequestItems extends Model {
        static associate() {
        }
    };
    MoveRequestItems.init({
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
        MoveRequestID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ItemDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Height: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Width: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Depth: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SpecialInstructions: {
            type: DataTypes.TEXT,
        },
    }, {
        sequelize,
        modelName: 'MoveRequestItems',
    });
    return MoveRequestItems;
}