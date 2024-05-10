module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MoveRequests', {
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
      UserID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MoveRequests');
  }
};