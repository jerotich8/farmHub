 const mysql = require("mysql2/promise");
 const dotenv = require ("dotenv");

 dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Function to create a database
const createDatabase = async () => {
    const dbName = process.env.DB_NAME;

    const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

    try {
        // Create the database
        
        await pool.query(createDbQuery); // Use await to handle the promise
        console.log(`Database '${dbName}' created or already exists.`);

        // Now, connect to the newly created database for table creation
        const db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName,
        });

        await createTables(db); // Call the function to create tables

    } catch (error) {
        console.error('Error creating database:', error);
    }
};


const createTables = async(db) => {
    

    const farmersTable = `
        CREATE TABLE IF NOT EXISTS farmers(
            farmer_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255),
            phone VARCHAR(15),
            date_of_birth DATE,
            gender ENUM ('Male', 'Female', 'Other'),
            address VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

    const cropsTable = `
        CREATE TABLE IF NOT EXISTS crops (
            crop_id INT,
            crop_name VARCHAR(255) PRIMARY KEY,
            crop_type ENUM ('cereals', 'vegetable', 'animal product'),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

    const marketsTable =`
        CREATE TABLE IF NOT EXISTS markets(
            market_id INT,
            market_name VARCHAR(255) PRIMARY KEY,
            county VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

    const yieldsTable = `
        CREATE TABLE IF NOT EXISTS yields(
            yield_id INT PRIMARY KEY AUTO_INCREMENT,
            farmer_id INT,
            crop_name VARCHAR(255) NOT NULL,
            growing_season ENUM ('Q1', 'Q2', 'Q3', 'Q4'),
            growing_year YEAR NOT NULL,
            harvest_date DATE,
            expected_yield INT,
            actual_yield INT NOT NULL,
            yield_quality ENUM ('good', 'average', 'poor'),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_name) REFERENCES crops(crop_name),
            FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        )`    

    const pricesTable = `
        CREATE TABLE IF NOT EXISTS prices(
            crop_id INT AUTO_INCREMENT PRIMARY KEY,
            crop_name VARCHAR(255),
            market_name VARCHAR(255),
            county VARCHAR(255),
            wholesale_price DECIMAL(10,2),
            retail_price DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_name) REFERENCES crops(crop_name),
            FOREIGN KEY (market_name) REFERENCES markets(market_name)
        )`

        try {
            await db.query(farmersTable);
            console.log('Farmers table created or already exists.');
    
            await db.query(cropsTable);
            console.log('Crops table created or already exists.');
    
            await db.query(marketsTable);
            console.log('Markets table created or already exists.');
    
            await db.query(yieldsTable);
            console.log('Yields table created or already exists.');

            await db.query(pricesTable);
            console.log('Prices table created or already exists.');
    
    
        } catch (error) {
            console.error('Error creating tables:', error);
    
        } 
    
    };
// Call the function to create the database
createDatabase();


module.exports = pool;