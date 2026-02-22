const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

router.post('/login', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const [results] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (results.length === 0) {
            return res.status(401).json({ erreur: 'Utilisateur introuvable' });
        }

        const valide = await bcrypt.compare(
            mot_de_passe,
            results[0].mot_de_passe
        );

        if (!valide) {
            return res.status(401).json({ erreur: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: results[0].id },
            'secret_lifearchive',
            { expiresIn: '24h' }
        );

        res.json({ token, nom: results[0].nom });

    } catch (err) {
        console.error("ERREUR LOGIN :", err);
        res.status(500).json({ erreur: err.message });
    }
});

module.exports = router;