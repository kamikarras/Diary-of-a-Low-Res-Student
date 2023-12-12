require('dotenv').config()

const { Database } = require("quickmongo");

async function initDatabase() {
    try {
        const db = new Database(process.env);

        db.on("ready", () => {
          console.log("Database connected!");
        });
        
      
        const databaseClient = await db.connect();
      
        console.log("Connected to database...");
      
        return databaseClient;
    } catch (error) {
        console.log('Error connecting to database: ', error);
    }

}

module.exports = initDatabase;