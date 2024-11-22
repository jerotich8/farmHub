const express = require("express");
const dotenv = require ("dotenv")
const app = express();
const db = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();



app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
