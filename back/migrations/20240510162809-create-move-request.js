'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MoveRequest', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      UserID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'uuid'
        }
      },
      moveStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      moveDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      moveTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      moveFrom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      moveTo: {
        type: Sequelize.STRING,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MoveRequest');
  }
};