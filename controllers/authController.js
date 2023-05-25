const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
require('dotenv').config()
const {JWT_ACCESS_SECRET} = process.env



module.exports = {
    async register(req, res) {
        let newUser;
        try {
            const { email, name, password } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: "Cet utilisateur existe déjà" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            newUser = await prisma.user.create({

                data: {
                    email,
                    name,
                    password : hashedPassword,
                },
            });

            res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la création de l'utilisateur" });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: "Identifiants invalides" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Identifiants invalides" });
            }
            const token = jwt.sign({ userId: user.id }, JWT_ACCESS_SECRET, { expiresIn: "24h" });
            res.status(200).json({ message: "Connexion réussie", user, token });
        } catch (error) {
            res.status(500).json({ error: "Une erreur s'est produite." });
        }
    },
    logout(req, res) {
        res.status(200).json({message: "Déconnexion réussie"});
    },
    authMiddleware(req,res,next){
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: "Non autorisé - Aucun jeton d'authentification fourni" });
        }
        try {
            const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Erreur lors de la vérification du jeton d'authentification:", error);
            return res.status(401).json({ error: "Non autorisé - Jeton d'authentification invalide" });
        }
    },
    async me(req, res) {

        try {
            const userId = req.user.userId;

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des informations de l'utilisateur" });
        }
    },
};
