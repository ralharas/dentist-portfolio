import express from 'express';
import db from '../models/db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Fetch home page content
router.get('/dashboard', async (req, res) => {
    const homeResult = await db.query('SELECT * FROM home_page WHERE id = 1');
    const navResult = await db.query('SELECT * FROM navbar ORDER BY id');
    const footerResult = await db.query('SELECT * FROM footer ORDER BY id');

    res.render('admin-dashboard', { 
        homePage: homeResult.rows[0], 
        navbar: navResult.rows, 
        footer: footerResult.rows 
    });
});

// Update homepage content
router.post('/update-home-page', async (req, res) => {
    const {
        hero_title, hero_description, hero_button_text, hero_button_link,
        services_title, service_1_title, service_1_description, service_2_title, 
        service_2_description, service_3_title, service_3_description, cta_title, 
        cta_button_text, cta_button_link, logo_text, logo_image, footer_text
    } = req.body;

    await db.query(`
        UPDATE home_page SET
        hero_title = $1, hero_description = $2, hero_button_text = $3, hero_button_link = $4,
        services_title = $5, service_1_title = $6, service_1_description = $7, service_2_title = $8,
        service_2_description = $9, service_3_title = $10, service_3_description = $11, cta_title = $12,
        cta_button_text = $13, cta_button_link = $14, logo_text = $15, logo_image = $16, footer_text = $17
        WHERE id = 1
    `, [
        hero_title, hero_description, hero_button_text, hero_button_link,
        services_title, service_1_title, service_1_description, service_2_title, 
        service_2_description, service_3_title, service_3_description, cta_title, 
        cta_button_text, cta_button_link, logo_text, logo_image, footer_text
    ]);

    res.redirect('/admin/dashboard');
});


// Update home page content
router.post('/update-home-page', async (req, res) => {
    const {
        hero_title,
        hero_description,
        hero_button_text,
        hero_button_link,
        services_title,
        service_1_title,
        service_1_description,
        service_2_title,
        service_2_description,
        service_3_title,
        service_3_description,
        cta_title,
        cta_button_text,
        cta_button_link
    } = req.body;

    await db.query(`
        UPDATE home_page SET
        hero_title = $1,
        hero_description = $2,
        hero_button_text = $3,
        hero_button_link = $4,
        services_title = $5,
        service_1_title = $6,
        service_1_description = $7,
        service_2_title = $8,
        service_2_description = $9,
        service_3_title = $10,
        service_3_description = $11,
        cta_title = $12,
        cta_button_text = $13,
        cta_button_link = $14
        WHERE id = 1
    `, [
        hero_title,
        hero_description,
        hero_button_text,
        hero_button_link,
        services_title,
        service_1_title,
        service_1_description,
        service_2_title,
        service_2_description,
        service_3_title,
        service_3_description,
        cta_title,
        cta_button_text,
        cta_button_link
    ]);

    res.redirect('/admin/dashboard');
});

// Handle login form submission
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            return res.redirect('/admin/menu'); 
        } else {
            res.status(401).send("Invalid username or password.");
        }
    } catch (error) {
        res.status(500).send("Database error: " + error.message);
    }
});


router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/admin/menu'); 
    }
    res.render('admin-login');
});


router.get('/menu', (req, res) => {
    res.render('admin-menu');
});

// Show navbar editor
router.get('/edit-navbar', async (req, res) => {
    const result = await db.query('SELECT * FROM navbar ORDER BY position ASC');
    res.render('edit-navbar', { navbar: result.rows });
});

// Add a new navbar item
router.post('/add-navbar', async (req, res) => {
    const { label, link, position } = req.body;

    // Ensure only 7 items are allowed
    const countResult = await db.query('SELECT COUNT(*) FROM navbar');
    if (parseInt(countResult.rows[0].count) >= 7) {
        return res.send("You can only have up to 7 navbar items.");
    }

    await db.query('INSERT INTO navbar (label, link, position) VALUES ($1, $2, $3)', [label, link, position]);
    res.redirect('/admin/edit-navbar');
});

// Delete a navbar item
router.post('/delete-navbar', async (req, res) => {
    const { id } = req.body;
    await db.query('DELETE FROM navbar WHERE id = $1', [id]);
    res.redirect('/admin/edit-navbar');
});



export default router;