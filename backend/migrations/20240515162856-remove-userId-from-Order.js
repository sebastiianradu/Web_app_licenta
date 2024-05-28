'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'userId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Asigură-te că tabelul de referință este corect
        key: 'id'
      }
    });
  }
};
