const sequelize = require('../config/database.js')
const { Sequelize } = require('sequelize');

const User = sequelize.define('user',{
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const ClothingArticle = sequelize.define('ClothingArticle', { 
  id: {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV4,
  primaryKey: true,
  allowNull: false
},
title: {
  type: Sequelize.STRING,
  allowNull: false
},
description: {
  type: Sequelize.TEXT,
  allowNull: false
},
price: {
  type: Sequelize.DECIMAL(10, 2),
  allowNull: false
},
imageUrl: {
  type: Sequelize.STRING,
  allowNull: false,
  validate: {
    isUrl: true // This validates the imageUrl field to ensure it contains a valid URL
  }
},
category: {
  type: Sequelize.STRING,
  allowNull: false
},
type:{
  type: Sequelize.STRING,
  allowNull: false
}
});

const Basket = sequelize.define('Basket', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  }
  // No need to define userId here; it will be added through the association
});

const BasketItem = sequelize.define('BasketItem', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  basketId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  clothingArticleId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  }
});

const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: Sequelize.ENUM('card', 'cash'),
    allowNull: false
  }
});

// Relationships
User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketItem);
BasketItem.belongsTo(Basket);

ClothingArticle.hasMany(BasketItem);
BasketItem.belongsTo(ClothingArticle);

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsTo(Basket);
Basket.hasOne(Order);

async function initialize(){
    await sequelize.authenticate();
    await sequelize.sync();
}

async function getUserDetailsById(userId) {
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['firstName', 'lastName', 'email'], // Only fetch these attributes
    });

    if (!user) {
      console.log('User not found');
      return null; // Or handle as per your application's needs
    }

    return user.dataValues; // Returns the user details
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error; // Rethrow or handle error as needed
  }
}


module.exports = { 
  initialize,
  User,
  ClothingArticle,
  BasketItem,
  Basket,
  getUserDetailsById,
  Order,
  sequelize
};
