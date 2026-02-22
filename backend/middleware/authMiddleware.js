const jwt = require('jsonwebtoken');

function verifierToken(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ erreur: "Token manquant" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "secret_lifearchive");
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ erreur: "Token invalide" });
    }
}

module.exports = verifierToken;