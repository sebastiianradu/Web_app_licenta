const express = require('express');
const jwt = require('jsonwebtoken');
const { loginMiddleware,createAccountMiddleware,verifyToken }  = require('../middleware/authMiddleware.js'); // Update the path as per your structure
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
  const { articleId, quantity, size} = req.body;

  try {
    // Find or create a basket for the user
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      // Dacă nu există un coș pentru utilizator, creează-l
      basket = await Basket.create({ userId });
    }

    // Adaugă articolul în coș
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

    // Check if basket is not null and has items
    if (basket.BasketItems && basket.BasketItems.length > 0) {
      const formattedItems = basket.BasketItems.map(item => {
        if (item && item.ClothingArticle) { // Check if item and item.ClothingArticle are not null
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
          return null; // Return null for invalid items
        }
      }).filter(item => item !== null); // Filter out null items
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
  const { itemId } = req.body; // Se așteaptă ID-ul elementului care trebuie șters în corpul cererii DELETE

  try {
    // Caută coșul de cumpărături al utilizatorului
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    // Șterge elementul din coșul de cumpărături
    await BasketItem.destroy({ where: { id: itemId, BasketId: basket.id } });

    // Returnează un răspuns de succes
    res.status(200).json({ message: 'Item removed from basket successfully' });
  } catch (error) {
    console.error('Error removing item from basket:', error);
    res.status(500).json({ message: 'Error removing item from basket' });
  }
});


router.get('/api/search', async (req, res) => {
  try {
      const searchTerm = req.query.term;

      // Read the contents of the articles.json file
      const jsonData = await fs.readFile('articles.json', 'utf8');
      const articles = JSON.parse(jsonData);

      // Search for articles based on the search term
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

// Definim ruta pentru pagina de comandă
router.post('/api/orders', async (req, res) => {
  try {

    // Extragem datele necesare din corpul cererii
    const { address, phoneNumber, paymentMethod } = req.body;

    console.log('Received order data:', {
      address: address,
      phoneNumber: phoneNumber,
      paymentMethod: paymentMethod
    });

    // Creăm o nouă înregistrare în tabelul Orders
    const newOrder = await Order.create({
      address: address,
      phoneNumber: phoneNumber,
      paymentMethod: paymentMethod
    });

    // Returnăm un răspuns de succes cu detaliile comenzii create
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    // Dacă apar erori, returnăm un mesaj de eroare și statusul corespunzător
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

//////////////////////////// Endpoint to clear the entire basket ////////////////////////////


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

// Endpoint to generate PDF with order details
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

    // Check if the directory exists, if not, create it
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

    // Add a delay to ensure the file is written before attempting to download
    setTimeout(() => {
      res.download(filePath, `user-${userId}-order.pdf`, (err) => {
        if (err) {
          console.error('Error downloading the PDF:', err);
          res.status(500).json({ message: 'Error downloading the PDF' });
        } else {
          fs.unlinkSync(filePath); // Delete the file after download
          console.log(`PDF ${filePath} deleted after download.`);
        }
      });
    }, 2000); // 2 seconds delay
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

module.exports = router;
