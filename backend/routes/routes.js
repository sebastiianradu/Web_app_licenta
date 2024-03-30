const express = require('express');
const jwt = require('jsonwebtoken');
const { loginMiddleware,createAccountMiddleware,verifyToken }  = require('../middleware/authMiddleware.js'); // Update the path as per your structure
const { Basket, BasketItem, User, getUserDetailsById, ClothingArticle } = require('../models/userModel.js');
const router = express.Router();

const secretKey = 'f3f9058acd9697628d66a9bca0ca05243151758d4e411a91b7c2230a94ec13fcde0281697aa4ce18a7d267542a924893dd4509cfb62c0905e5a67499ee2408c4';

//////////////////////// LogIn /////////////////////////

router.post('/api/login', loginMiddleware, (req, res) => {
    const token = jwt.sign({ id: req.user.id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token, user: req.user });
});

router.post('/api/create-account', createAccountMiddleware, (req, res) => {
    const { id } = req.newUser; // newUser was attached to the req object in the middleware
    res.status(201).json({ message: 'Account created successfully', userId: id });
});

/////////////////////// main page ///////////////////////



// const articles = [
//     { id: 1, title: 'Running Shoes', description: 'High-quality running shoes.', price: 100 },
//     { id: 2, title: 'Yoga Mat', description: 'Eco-friendly yoga mat.', price: 50 },
//     // Add more articles as needed
//   ];


// // Temporary data for articles
// router.get('/api/articles', (req, res) => {
//     res.json(articles);
//   });


//////////////////////// JWT /////////////////////////////

router.get('/api/user/details', verifyToken, async (req, res) => {
    try {
      // Assuming you have a method to find a user by ID
      // The user ID should be stored in req.user.id based on the JWT verification
      const userDetails = await getUserDetailsById(req.user.id);
      if (userDetails) {
        res.json(userDetails);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
//////////////////////////// JWT verif //////////////////////////////////////


router.post('/api/auth/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the Authorization header
  
  if (!token) {
    return res.status(401).send("No token provided.");
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).send("Token is invalid.");
    }

    try {
      // Fetch user details from the database using the decoded ID
      const user = await getUserDetailsById(decoded.id);
      if (!user) {
        return res.status(404).send("User not found.");
      }

      // Respond with the user details
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).send("Internal server error.");
    }
  });
});


/////////////////////////////// articles /////////////////////////////////

router.get('/api/articles', async (req, res) => {
  try {
    const { category } = req.query;
    let queryOptions = {};
    if (category) {
      queryOptions.where = { category };
    }

    const articles = await ClothingArticle.findAll(queryOptions);
    res.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
});

router.get('/api/articles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await ClothingArticle.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Failed to fetch article:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
});

////////////////////////////////// cosul meu ////////////////////////////////////


router.post('/api/basket', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { articleId, quantity } = req.body;

  try {
    // Find or create a basket for the user
    const [basket, created] = await Basket.findOrCreate({ where: { userId } });

    // Add the article to the basket
    const basketItem = await BasketItem.create({
      basketId: basket.id,
      clothingArticleId: articleId,
      quantity
    });

    res.status(201).json(basketItem);
    console.log(basketItem);
  } catch (error) {
    console.error('Error adding item to basket:', error);
    res.status(500).json({ message: 'Error adding item to basket' });
  }
});

// Endpoint to retrieve the user's basket
router.get('/api/basket', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const basket = await Basket.findOne({ where: { userId }, include: [{
      model: BasketItem,
      include: [{
        model: ClothingArticle
      }]
    }] });


    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }
    
    const formattedItems = basket && basket.BasketItems ? basket.BasketItems.map(item => {
      return {
        id: item.id,
        quantity: item.quantity,
        ClothingArticle: item.ClothingArticle // Ensure this structure matches what your front-end expects
      };
    }) : [];
    res.json(formattedItems);

  } catch (error) {
    console.error('Error retrieving basket:', error);
    res.status(500).json({ message: 'Error retrieving basket' });
  }
});



module.exports = router;
