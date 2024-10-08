'use strict';

const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config()
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.MoveRequest, { foreignKey: 'UserID' });
      this.hasMany(models.PriceProposal, { foreignKey: 'MoverID' });
      this.hasMany(models.PriceProposal, { foreignKey: 'MovingID' });
      this.hasMany(models.VehicleInfo, { foreignKey: 'MoverID' });
          // Reviews given by the user
      this.hasMany(models.Review, { as: 'GivenReviews', foreignKey: 'RequesterID' });
    
      // Reviews received by the user
      this.hasMany(models.Review, { as: 'ReceivedReviews', foreignKey: 'ProviderID' });
    }
  }
  Users.init({
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
  firstName: {
      type: DataTypes.STRING,
      allowNull: true
  },
  lastName: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
  },
  PhotoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
        isUrl: true
    }
  },
  salt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
  },
  token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    },
    token_exp: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
          isDate: true,
          notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Users',
  });


  // Method 3 via the direct method
  Users.beforeValidate((user, options) => {
  console.log("test before create",user.uuid)
  const {uuid,username} = user
  user.token = jwt.sign({uuid:uuid,username:username  }, process.env.JWT_SECRET, { expiresIn: '7d' });
});

  return Users;
};