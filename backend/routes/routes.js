const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { loginMiddleware,createAccountMiddleware,verifyToken }  = require('../middleware/authMiddleware.js');
const { Basket, BasketItem, Order, User, getUserDetailsById, getBasketItemDetails, ClothingArticle } = require('../../backend/models/userModel.js');
const router = express.Router();
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const secretKey = 'f3f9058acd9697628d66a9bca0ca05243151758d4e411a91b7c2230a94ec13fcde0281697aa4ce18a7d267542a924893dd4509cfb62c0905e5a67499ee2408c4';

//////////////////////// LogIn /////////////////////////

router.post('/api/login', loginMiddleware, (req, res) => {
    const token = jwt.sign({ id: req.user.id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token, user: req.user });
});

router.post('/api/create-account', createAccountMiddleware, (req, res) => {
    const { id } = req.newUser; 
    res.status(201).json({ message: 'Account created successfully', userId: id });
});


//////////////////////// JWT /////////////////////////////

router.get('/api/user/details', verifyToken, async (req, res) => {
    try {
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
  const token = authHeader && authHeader.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).send("No token provided.");
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).send("Token is invalid.");
    }

    try {
      const user = await getUserDetailsById(decoded.id);
      if (!user) {
        return res.status(404).send("User not found.");
      }

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


/////////////////////////////// articole /////////////////////////////////

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
  const { articleId, quantity, size} = req.body;

  try {
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.create({ userId });
    }

    const basketItem = await BasketItem.create({
      basketId: basket.id,
      clothingArticleId: articleId,
      quantity: quantity,
      size: size
    });

    res.json({
      basketId: basket.id,
      basketItemId: basketItem.id,
      clothingArticleId: articleId,
      quantity: quantity,
      size: size
    });
    console.log({
      basketId: basket.id,
      basketItemId: basketItem.id,
      clothingArticleId: articleId,
      quantity: quantity,
      size: size
    });
  } catch (error) {
    console.error('Error adding item to basket:', error);
    res.status(500).json({ message: 'Error adding item to basket' });
  }
});


router.get('/api/basket', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const basket = await Basket.findOne({ 
      where: { userId }, 
      include: [{ 
        model: BasketItem, 
        include: [{ 
          model: ClothingArticle 
        }] 
      }] 
    });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    if (basket.BasketItems && basket.BasketItems.length > 0) {
      const formattedItems = basket.BasketItems.map(item => {
        if (item && item.ClothingArticle) { 
          return {
            id: item.id,
            quantity: item.quantity,
            clothingArticle: {
              id: item.ClothingArticle.id,
              title: item.ClothingArticle.title,
              price: item.ClothingArticle.price,
              imageUrl: item.ClothingArticle.imageUrl,
              sizes: item.size
            }
          };
        } else {
          return null; 
        }
      }).filter(item => item !== null); 
      res.json(formattedItems);
      console.log(formattedItems);
    } else {
      res.status(404).json({ message: 'Basket is empty' });
    }
    
  } catch (error) {
    console.error('Error retrieving basket:', error);
    res.status(500).json({ message: 'Error retrieving basket' });
  }
});

router.delete('/api/basket', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body; 
  try {
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    await BasketItem.destroy({ where: { id: itemId, BasketId: basket.id } });

    res.status(200).json({ message: 'Item removed from basket successfully' });
  } catch (error) {
    console.error('Error removing item from basket:', error);
    res.status(500).json({ message: 'Error removing item from basket' });
  }
});


router.get('/api/search', async (req, res) => {
  try {
      const searchTerm = req.query.term;

      
      const jsonData = await fs.readFile('articles.json', 'utf8');
      const articles = JSON.parse(jsonData);

      
      const filteredArticles = articles.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      res.json(filteredArticles);
  } catch (error) {
      console.error('Error searching articles:', error);
      res.status(500).json({ message: 'Error searching articles' });
  }
});

////////////////////////////// ORDER //////////////////////////////////////

router.post('/api/orders', async (req, res) => {
  try {

    const { address, phoneNumber, paymentMethod } = req.body;

    console.log('Received order data:', {
      address: address,
      phoneNumber: phoneNumber,
      paymentMethod: paymentMethod
    });

    const newOrder = await Order.create({
      address: address,
      phoneNumber: phoneNumber,
      paymentMethod: paymentMethod
    });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

//////////////////////////// Endpoint pt a goli cosul ////////////////////////////


router.delete('/api/basket/clear', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    await BasketItem.destroy({ where: { basketId: basket.id } });
    res.status(200).json({ message: 'Basket cleared successfully' });
  } catch (error) {
    console.error('Error clearing basket:', error);
    res.status(500).json({ message: 'Error clearing basket' });
  }
});

////////////////////////// PDF ///////////////////////////

router.get('/api/pdf', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      include: {
        model: Basket,
        include: {
          model: BasketItem,
          include: [ClothingArticle]
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pdfDir = path.join(__dirname, '..', 'pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
      console.log(`Directory ${pdfDir} created.`);
    }

    const filePath = path.join(pdfDir, `user-${userId}-order.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('Order Details', { align: 'center' });
    doc.text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Address: ${user.address}`);
    doc.text(`Phone Number: ${user.phoneNumber}`);
    doc.moveDown();

    if (user.Basket && user.Basket.BasketItems.length > 0) {
      doc.fontSize(18).text('Items:', { underline: true });
      user.Basket.BasketItems.forEach(item => {
        doc.text(`- ${item.ClothingArticle.title} (Quantity: ${item.quantity}, Size: ${item.size}, Price: $${item.ClothingArticle.price})`);
      });
    } else {
      doc.text('No items in the basket.');
    }

    doc.end();
    console.log(`PDF created at ${filePath}`);

    setTimeout(() => {
      res.download(filePath, `user-${userId}-order.pdf`, (err) => {
        if (err) {
          console.error('Error downloading the PDF:', err);
          res.status(500).json({ message: 'Error downloading the PDF' });
        } else {
          fs.unlinkSync(filePath); 
          console.log(`PDF ${filePath} deleted after download.`);
        }
      });
    }, 2000); 
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

////////////////////// ML ////////////////////////////



router.post('/api/predict-price', async (req, res) => {
  try {
    const { articleId } = req.body;

    const article = await ClothingArticle.findByPk(articleId);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const createdAt = new Date(article.createdAt);
    const month = createdAt.getMonth() + 1; 
    const year = createdAt.getFullYear();

    const data = {
      month: month,
      year: year,
      type_of_article: article.type,
      category: article.category,
      price: article.price 
    };

    const response = await axios.post('http://127.0.0.1:5000/predict', data);
    res.json(response.data);
  } catch (error) {
    console.error('Error predicting price:', error);
    res.status(500).json({ message: 'Error predicting price' });
  }
});



module.exports = router;
