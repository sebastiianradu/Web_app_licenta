const bcrypt = require('bcrypt');
const { User, ClothingArticle } = require('../../backend/models/userModel'); 

const loginMiddleware = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.user = user;

    next(); 
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Server error" });
  }
};

//----------------------------------------------------------------------------- Hash pass:

const createAccountMiddleware = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    req.newUser = newUser;

    next(); 
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//----------------------------------------------------------------------------

const fs = require('fs').promises;
const path = require('path');

async function addClothingArticle(title, description, price, imageUrl, category, type, sizes) {
  try {
    const article = await ClothingArticle.create({
      title,
      description,
      price,
      imageUrl,
      category,
      type,
      sizes 
    });
    console.log('Article added:', article.toJSON());
  } catch (error) {
    console.error('Error adding article:', error);
  }
}

async function addAllClothingArticles() {
  try {
    const articlesPath = path.join(__dirname, '../middleware/articles.json');
    const articlesData = await fs.readFile(articlesPath, 'utf8');
    const articles = JSON.parse(articlesData);

    for (const article of articles) {
      await addClothingArticle(article.title, article.description, article.price, article.imageUrl, article.category, article.type, article.sizes);
    }

    console.log('All articles added.');
  } catch (error) {
    console.error('Error reading articles from JSON:', error);
  }
}

//--------------------------------------------------------------------------------------------------

const jwt = require('jsonwebtoken');
const secretKey = 'f3f9058acd9697628d66a9bca0ca05243151758d4e411a91b7c2230a94ec13fcde0281697aa4ce18a7d267542a924893dd4509cfb62c0905e5a67499ee2408c4'; // Use the same secret key as for signing the tokens

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(403).send("Invalid token.");
  }
};

module.exports = {
  loginMiddleware,
  createAccountMiddleware,
  addAllClothingArticles,
  verifyToken
}
