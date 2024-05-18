'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PriceProposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      RequestID: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
          notEmpty: true,
        },
        references: {
          model: 'MoveRequest',
          key: 'uuid'
        }
      },
      MoverID: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
          notEmpty: true,
        },
      },
      MovingID: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
          notEmpty: true,
        },
      },
      EstimatedCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          notEmpty: true,
        }
      },
      PriceStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PriceProposals');
  }
};