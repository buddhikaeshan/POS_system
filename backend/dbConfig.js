const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    //added new code
    pool: {
      max: 50, 
      min: 10,
      acquire: 30000,
      idle: 10000
    }
    //close
  }
);

// Function to create or append the error to a .txt file
const writeErrorToFile = (error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] - Error: ${error.message}\nStack Trace:\n${error.stack}\n\n`;

  // Write the error details to a file
  fs.writeFile("error.txt", logMessage, { flag: "a" }, (err) => {
    if (err) {
      console.error("Failed to write to the text file:", err.message);
    } else {
      console.log("Error details written to error.txt.");
    }
  });
};

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to the MySQL.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
    writeErrorToFile(err);
  });

module.exports = sequelize;
