const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require ("dotenv")
const app = express();


app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use('/farmhub/api/users', require('./routes/auth'));
app.use('/farmhub/api', require('./routes/track'));
app.use('/farmhub/api', require('./routes/market'));


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
