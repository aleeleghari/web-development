const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

dotenv.config({ path: ".env" });

const adminRoutes = require('./routes/admin');

const server = express();


// Middleware setup
server.use(expressLayouts);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));

server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,  // Important: Ensure the session is saved even if not modified
}));

// Initialize passport after session middleware
server.use(passport.initialize());
server.use(passport.session());




// EJS view engine configuration
server.set("view engine", "ejs"); 
server.set("views", __dirname + "/views");

// MongoDB connection 
// Connect to MongoDB
const dbURI = process.env.MONGO_URI ;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
server.use('/admin', adminRoutes);









// Define your routes
server.get('/', (req, res) => {
    res.render('user/index', { layout: 'layouts/AdminLayout' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
