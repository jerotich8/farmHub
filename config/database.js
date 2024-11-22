 const mysql = require("mysql2");
 const dotenv = require ("dotenv");

 dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Function to create a database
const createDatabase = () => {
    const dbName = process.env.DB_NAME;

    const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

    db.query(createDbQuery, (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log(`Database '${dbName}' created or already exists.`);
    });

    // Close the connection after the query
    db.end();

    createTables(dbName);
};

const createTables = (dbName) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

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
            crop_name VARCHAR(255),
            growing_season ENUM ('Q1', 'Q2', 'Q3', 'Q4'),
            harvest_date DATE,
            expected_yield INT,
            actual_yield INT NOT NULL,
            yield_quality ENUM ('good', 'average', 'poor'),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_name) REFERENCES crops(crop_name)
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

    pool.query(farmersTable, (err, result) => {
        if (err) {
            console.error('Error creating farmers table:', err);
            pool.end(); // Close the pool if there's an error
            return;
        }
        console.log('Farmers table created or already exists.');

        pool.query(cropsTable, (err, result) => {
            if (err) {
                console.error('Error creating crops table:', err);
                pool.end(); // Close the pool if there's an error
                return;
            }
            console.log('Crops table created or already exists.');

            pool.query(marketsTable, (err, result) => {
                if (err) {
                    console.error('Error creating markets table:', err);
                    pool.end(); // Close the pool if there's an error
                    return;
                }
                console.log('Markets table created or already exists.');

                pool.query(yieldsTable, (err, result) => {
                    if (err) {
                        console.error('Error creating yields table:', err);
                        pool.end(); // Close the pool if there's an error
                        return;
                    }
                    console.log('Yields table created or already exists.');

                    pool.query(pricesTable, (err, result) => {
                        if (err) {
                            console.error('Error creating prices table:', err);
                            pool.end(); // Close the pool if there's an error
                            return;
                        }
                        console.log('Prices table created or already exists.');

                        // End the pool after all tables are created
                        pool.end();
                    });
                });
            });
        });
    });    
}

// Call the function to create the database
createDatabase();


module.exports = db.promise();