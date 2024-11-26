const db = require('../config/database');

exports.createYield = async(req,res) => {
    const { crop_name, growing_season, growing_year, harvest_date, expected_yield, actual_yield, yield_quality } = req.body;
    const farmer_id = req.user.id;

    try{
        if (!crop_name || !growing_season || !growing_year || !harvest_date || !expected_yield || !actual_yield || !yield_quality) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        await db.execute (
            `INSERT INTO yields (farmer_id,crop_name, growing_season, growing_year, harvest_date, expected_yield, actual_yield, yield_quality) VALUES (?,?, ?, ?, ?, ?, ?, ?)`,
            [farmer_id,crop_name, growing_season, growing_year, harvest_date, expected_yield, actual_yield, yield_quality]
        );

        res.status(201).json({ message: 'Yield-tracking data created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating yield data' });
    }   
};

exports.getYield = async(req,res) => {
    const userId = req.user.id

    try {
        const query = 'SELECT * FROM yields WHERE farmer_id = ?';
        const [rows] = await db.execute(query, [userId]);
    
        if (rows.length === 0) {
          return res.status(404).json({ message: 'No yield data found.' });
        }
    
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};