/**
 * Sortable/draggable records
 */
module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('sections', 'sortable', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }),

    queryInterface.addColumn('records', 'position', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    }),
  ],

  down: queryInterface => [
    queryInterface.removeColumn('sections', 'sortable'),
    queryInterface.removeColumn('records', 'position'),
  ],
};
