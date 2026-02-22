const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const db = require('../config/db');
const verifierToken = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', verifierToken, async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT d.*, c.nom as categorie 
             FROM documents d 
             LEFT JOIN categories c ON d.categorie_id = c.id 
             WHERE d.user_id = ? 
             ORDER BY d.date_upload DESC`,
            [req.userId]
        );

        res.json(results);

    } catch (err) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
});

router.post('/', verifierToken, upload.single('fichier'), async (req, res) => {
    try {
        const { nom, description, categorie_id } = req.body;
        const fichier_path = req.file.path;

        await db.query(
            'INSERT INTO documents (user_id, categorie_id, nom, description, fichier_path) VALUES (?, ?, ?, ?, ?)',
            [req.userId, categorie_id, nom, description, fichier_path]
        );

        res.json({ message: 'Document ajouté !' });

    } catch (err) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
});

router.delete('/:id', verifierToken, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM documents WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );

        res.json({ message: 'Document supprimé !' });

    } catch (err) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM categories');
        res.json(results);

    } catch (err) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
});

module.exports = router;