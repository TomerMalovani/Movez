const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            this.hasMany(models.MoveRequest, { foreignKey: 'UserID' });
            this.hasMany(models.PriceProposal, { foreignKey: 'MoverID' });
            this.hasMany(models.PriceProposal, { foreignKey: 'MovingID' });
            this.hasMany(models.VehicleInfo, { foreignKey: 'MoverID' });
            this.hasMany(models.MoveRequestItems, { foreignKey: 'UserID' });
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