const db = require('../config/database'); // Import your database connection

exports.getPrices = async(req,res) => {

    try {
        const query = 'SELECT * FROM prices';
        const [rows] = await db.execute(query);
    
        if (rows.length === 0) {
          return res.status(404).json({ message: 'No market prices data found.' });
        }
    
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.searchPrices = async (req, res) => {
    
    const { product, market, county } = req.query;

    try {
        // Start building the query
        let query = 'SELECT * FROM prices WHERE 1=1';
        const params = [];

        // Conditionally add filters based on the query parameters
        if (product) {
            query += ' AND crop_name LIKE ?';
            params.push(`%${product}%`);
        }
        if (market) {
            query += ' AND market_name LIKE ?';
            params.push(`%${market}%`);
        }
        if (county) {
            query += ' AND county LIKE ?';
            params.push(`%${county}%`);
        }

        // Execute the query with the parameters
        const [results] = await db.query(query, params);

        // Process the data before sending it to the client
        const processData = (data) => {
            return data.map(item => {
                // Check for fields with binary data (Buffer type)
                Object.keys(item).forEach(key => {
                    if (Buffer.isBuffer(item[key])) {
                        // Example: If it's a Buffer, convert to string (or any relevant processing)
                        item[key] = item[key].toString('utf8');
                    }
                });

                // Handle potential null values, default to empty string or 0 where necessary
                if (item.retail_price === null) {
                    item.retail_price = "Not Available"; // or handle it as needed
                }
                if (item.wholesale_price === null) {
                    item.wholesale_price = "Not Available"; // or handle it as needed
                }

                return item;
            });
        };

        // Process the results before sending
        const processedResults = processData(results);

        // Send the processed results as a response
        res.json(processedResults);
    } catch (error) {
        console.error('Error searching prices:', error);
        res.status(500).json({ message: 'An error occurred while searching for market prices.' });
    }
};
