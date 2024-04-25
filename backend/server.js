const express = require('express');
const cors = require('cors');
const { ClothingArticle, initialize, sequelize } = require('../backend/models/userModel.js');// const app = express();
const router = require('../Backend/routes/routes.js');
const { addAllClothingArticles } = require('../Backend/middleware/authMiddleware.js')


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(router);

async function migrate() {
    try {
      await sequelize.sync(); // This will drop the table if it already exists
      console.log('Migration completed.');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
  
async function start() {
    try {
      await initialize(); // This initializes your sequelize
      await migrate(); // Now migrate can safely be called
      // Other startup code
    } catch (error) {
      console.error('Failed to start the server:', error);
    }
  }
  



start();


// // Assuming ClothingArticle is your model from an ORM like Sequelize
// app.get('/api/articles', async (req, res) => {
//   try {
//     // Retrieve the 'category' query parameter from the request
//     const { category } = req.query;

//     let queryOptions = {};
//     // If a category is specified, add a filter condition
//     if (category) {
//       queryOptions.where = { category: category };
//     }

//     // Pass the query options to findAll
//     const articles = await ClothingArticle.findAll(queryOptions);

//     res.json(articles);
//   } catch (error) {
//     console.error('Failed to fetch articles:', error);
//     res.status(500).json({ message: 'Failed to fetch articles' });
//   }
// });

async function deleteRows() {
  try {
    // This will delete the first 3 rows based on your model's primaryKey (usually `id`)
    const rowsToDelete = await ClothingArticle.findAll({ order: [['id', 'ASC']], limit: 6 });
    
    for (const row of rowsToDelete) {
      await row.destroy();
    }

    console.log('Rows deleted successfully.');
  } catch (error) {
    console.error('There was an error deleting the rows:', error);
  }
}

// addAllClothingArticles();
// deleteRows();

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})