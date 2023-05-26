const { PrismaClient } = require("@prisma/client");
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
require('dotenv').config()
const {JWT_ACCESS_SECRET} = process.env



module.exports = {
    authMiddleware(req,res,next){
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Action impossible. Merci de vous connecter." });
        }
        try {
            const tokenSplit = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(tokenSplit, JWT_ACCESS_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Erreur lors de la vérification du jeton", error);
            return res.status(401).json({ error: "Jeton invalide" });
        }
    },
};
