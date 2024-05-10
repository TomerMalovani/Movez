'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VehicleInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      MoverID: {
        type: Sequelize.UUID,
        allowNull: false
      },
      VehicleType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Depth: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      Width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      Height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VehicleInfos');
  }
};
