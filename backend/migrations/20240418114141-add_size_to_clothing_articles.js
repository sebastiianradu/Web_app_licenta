'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change the column to NOT NULL
    await queryInterface.changeColumn('ClothingArticles', 'size', {
      type: Sequelize.JSONB,
      allowNull: false // Add NOT NULL constraint
    });
    
    // Update existing rows to set default size
    // Adjust the update query based on your needs
    await queryInterface.sequelize.query(`
      UPDATE "ClothingArticles"
      SET "size" = '{"S": "41", "M": "42", "L": "43", "XL": "44"}'
      WHERE "size" IS NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes made in the "up" migration
    await queryInterface.changeColumn('ClothingArticles', 'size', {
      type: Sequelize.JSONB,
      allowNull: true
    });
  }
};
