'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ClothingArticles', 'sizes', {
      type: Sequelize.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sizes');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('sizes', JSON.stringify(value));
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ClothingArticles', 'sizes');
  }
};
