const express = require('express');
const cors = require('cors');
const { User,ClothingArticle, initialize, sequelize } = require('../backend/models/userModel.js');
const router = require('../Backend/routes/routes.js');
const { addAllClothingArticles } = require('../Backend/middleware/authMiddleware.js')


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})


async function migrate() {
    try {
      await sequelize.sync(); 
      console.log('Migration completed.');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
  
async function start() {
    try {
      await initialize();
      await migrate();
    } catch (error) {
      console.error('Failed to start the server:', error);
    }
  }
  



start();



async function deleteRows() {
  try {
    const rowsToDelete = await User.findAll({ order: [['id', 'ASC']], limit: 11 });
    
    for (const row of rowsToDelete) {
      await row.destroy();
    }

    console.log('Rows deleted successfully.');
  } catch (error) {
    console.error('There was an error deleting the rows:', error);
  }
}


// deleteRows();
// addAllClothingArticles();

