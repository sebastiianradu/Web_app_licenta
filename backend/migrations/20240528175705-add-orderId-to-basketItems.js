'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('BasketItems', 'OrderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BasketItems', 'OrderId');
  }
};
