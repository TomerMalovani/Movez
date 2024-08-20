'use strict';
const { Model } = require('sequelize'); // Importing Model

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Associating Review with Users
      this.belongsTo(models.Users, { as: 'Requester', foreignKey: 'RequesterID' });
      this.belongsTo(models.Users, { as: 'Provider', foreignKey: 'ProviderID' });
    }
  }
  
  Review.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        notEmpty: true
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    RequesterID: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ProviderID: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
  });

  return Review;
};
