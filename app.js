import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/db.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Session middleware
app.use(session({
    secret: 'rawad22123431wewsdadrt321',
    resave: false,
    saveUninitialized: true
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
import indexRouter from './routes/index.js';
import adminRouter from './routes/admin.js';
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});