const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

const signup = require('./routes/signup');
const logout = require('./routes/logout');
const login = require('./routes/login');
const sendEmail = require('./routes/sendEmail');

app.use('/', signup);
app.use('/', logout);
app.use('/', login);
app.use('/sendotp', sendEmail);

app.get('/', (req, res) => {
    res.send("home page");
});

app.listen(8000, () => {
    console.log("Server is Running");
});
