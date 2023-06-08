const { PrismaClient } = require("@prisma/client");
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
require('dotenv').config()
const {JWT_ACCESS_SECRET} = process.env



module.exports = {
    authMiddleware(req, res, next) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Action impossible. Merci de vous connecter." });
        }
        try {
            const tokenSplit = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(tokenSplit, JWT_ACCESS_SECRET);
            const userId = decoded.userId;
            prisma.user
                .findUnique({
                    where: { id: userId },
                })
                .then((user) => {
                    if (user) {
                        req.user = { ...decoded, name: user.name };
                        next();
                    } else {
                        return res.status(401).json({ error: "Utilisateur introuvable" });
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des informations de l'utilisateur", error);
                    return res.status(500).json({ error: "Erreur de serveur" });
                });
        } catch (error) {
            console.error("Erreur lors de la vérification du jeton", error);
            return res.status(401).json({ error: "Jeton invalide" });
        }
    }
};
