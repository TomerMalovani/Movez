const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(PriceProposal, MoveRequestItems, MoveRequest, VehicleInfo) {
            this.hasMany(MoveRequest, { foreignKey: 'UserID' });
            this.hasMany(PriceProposal, { foreignKey: 'MoverID' });
            this.hasMany(PriceProposal, { foreignKey: 'MovingID' });
            this.hasMany(VehicleInfo, { foreignKey: 'MoverID' });
            this.hasMany(MoveRequestItems, { foreignKey: 'UserID' });
        }
    };
    Users.init({
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
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Users',
    });
    return Users;
}