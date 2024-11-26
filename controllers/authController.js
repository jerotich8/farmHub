const db = require('../config/database');
const bcrypt= require ('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.registerFarmer = async (req,res) => {
    const { email,password,first_name,last_name,phone,gender,address} = req.body;

    try{
        const [rows] = await db.execute ('SELECT * FROM farmers WHERE email = ?', [email]);
        if (rows.length > 0){
            return res.status(400).json ({message:'User already exists'});
        }
        //hash password
        const password_hash = await bcrypt.hash(password,10);

        //insert farmer into database
        await db.execute(
            'INSERT INTO farmers (first_name, last_name, email, password_hash, phone, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, password_hash, phone, gender, address]
        );

        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering farmer' });
    }
}

exports.loginFarmer = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Fetch the farmer from the database using email
        const [rows] = await db.execute('SELECT * FROM farmers WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Farmer not found! Please register.' });
        }
        
        const farmer = rows[0];

        // Check if the password is valid using bcrypt
        const isPasswordValid = await bcrypt.compare(password, farmer.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token after successful login
        const token = jwt.sign(
            {
                id: farmer.farmer_id,
                first_name: farmer.first_name,
                last_name: farmer.last_name,
                email: farmer.email,
                phone: farmer.phone,
                date_of_birth: farmer.date_of_birth,
                gender: farmer.gender,
                address: farmer.address,
            },
            SECRET_KEY, // Secret key for signing the token
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token back to the client
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Send JWT token to client
            patient: { // Optionally, send some patient info
                id: farmer.patient_id,
                first_name: farmer.first_name,
                email: farmer.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
};

exports.getProfile = (req, res) => {
    // Assuming req.user is set by the authenticateToken middleware
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    res.json({
        message: 'Profile fetched successfully',
        user: req.user // This contains user information from the token
    });
};