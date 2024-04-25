'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the column
    await queryInterface.removeColumn('ClothingArticles', 'size');
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert the change, you'll need to define a 'down' function
    // For example, if you want to re-add the column, you'll define it here
    await queryInterface.addColumn('ClothingArticles', 'size', {
      type: Sequelize.JSONB,
      allowNull: true
    });
  }
};
