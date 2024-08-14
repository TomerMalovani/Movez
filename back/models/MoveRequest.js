'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoveRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'UserID' });
      this.belongsTo(models.PriceProposal, { foreignKey: 'uuid' });
      this.hasMany(models.MoveRequestItems, { foreignKey: 'MoveRequestID' });
    }
  }
  MoveRequest.init({
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
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    moveFromCoor: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },


    moveToCoor: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    fromAddress:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    toAddress:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
	distance: {
		type: DataTypes.DECIMAL,
		allowNull: true,
		validate: {
			isDecimal: true
		}

  }}
  , {
    sequelize,
    modelName: 'MoveRequest',
    tableName: 'MoveRequest'
  });

	MoveRequest.beforeCreate(async (moveRequest) => {
		const distance = await sequelize.query(
			`SELECT ST_DistanceSphere(ST_GeomFromText('POINT(${moveRequest.moveFromCoor.coordinates[0]} ${moveRequest.moveFromCoor.coordinates[1]})'), ST_GeomFromText('POINT(${moveRequest.moveToCoor.coordinates[0]} ${moveRequest.moveToCoor.coordinates[1]})'))`
		);
		moveRequest.distance = distance[0][0].st_distancesphere;
	});

  
  // afterFind hook to check if the move time has passed

  MoveRequest.afterFind(async (moveRequests, options) => {

    if (moveRequests) {

      const now = new Date();

      // Handle both single instance and array of instances

      const moveRequestsArray = Array.isArray(moveRequests) ? moveRequests : [moveRequests];
      
      for (let moveRequest of moveRequestsArray) {

        if (moveRequest.moveTime < now && moveRequest.moveStatus !== 'Canceled') {

          moveRequest.moveStatus = 'Canceled';

          await moveRequest.save();

        }

      }

    }

  });

  return MoveRequest;
};

// npx sequelize-cli migration:generate --name change-moveFrom-type-in-MoveRequest