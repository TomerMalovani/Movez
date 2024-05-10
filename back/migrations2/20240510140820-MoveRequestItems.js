'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MoveRequestItems', {
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
      MoveRequestID: {
        type: Sequelize.UUID,
        allowNull: false
      },
      ItemDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Height: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      Width: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      Depth: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      Weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      SpecialInstructions: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('MoveRequestItems');
  }
};