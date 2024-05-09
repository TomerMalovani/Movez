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
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
    }, {
        sequelize,
        modelName: 'Users',
    });
    return Users;
}