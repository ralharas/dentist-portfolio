import express from 'express';
import db from '../models/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch homepage content
        const homeResult = await db.query('SELECT * FROM home_page WHERE id = 1');
        const homePage = homeResult.rows[0];

        // Fetch navbar items
        const navResult = await db.query('SELECT * FROM navbar ORDER BY id');
        const navbar = navResult.rows;

        // Fetch footer text
        const footerResult = await db.query('SELECT * FROM footer ORDER BY id');
        const footer = footerResult.rows;

        res.render('index', { homePage, navbar, footer });
    } catch (error) {
        console.error("Error fetching site content:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/before-after', async (req, res) => {
    const result = await db.query('SELECT * FROM before_after');
    res.render('before-after', { cases: result.rows });
});

export default router;