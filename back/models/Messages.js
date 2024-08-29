'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users,{foreignKey:'FromID'} );
      this.belongsTo(models.Users, { foreignKey: 'ToID' });
    }
  }
  Messages.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
  },
  FromID: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
          isUUID: 4,
          notEmpty: true
      }
  },
  ToID: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
        isUUID: 4,
        notEmpty: true
    }
},
  Content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
  },
 
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};