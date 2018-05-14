/**
 * Creates initial User schema
 */
module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      created_at: {
        type: Sequelize.DATE,
      },

      updated_at: {
        type: Sequelize.DATE,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      password_digest: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }),
  ],

  down: queryInterface => [
    queryInterface.dropTable('users'),
  ],
};
