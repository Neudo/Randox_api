const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {CourierClient} = require("@trycourier/courier");
const prisma = new PrismaClient();
require('dotenv').config()
const {JWT_ACCESS_SECRET, API_KEY, SITE_URL} = process.env
const courier = CourierClient({ authorizationToken: `${API_KEY}` });

module.exports = {
    async register(req, res, next) {
        let newUser;
        try {
            const {email, name, password} = req.body;

            const errors = []
            if (!req.body.email) {
                errors.push("Merci d'entrer une adresse mail")
            }
            if (!req.body.name) {
                errors.push("Merci d'entrer un prénom")
            }
            if (!req.body.password) {
                errors.push("Merci d'entrer un mot dde passe")
            }

            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        {email},
                        {name}
                    ]
                }
            });
            if (existingUser) {
                return res.status(400).json({error: "Cet utilisateur existe déjà"});
            }
            if (errors.length ) {
                return res.status(400).json({error: errors})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                newUser = await prisma.user.create({

                    data: {
                        email,
                        name,
                        password: hashedPassword,
                        stripe_customer_id: '',
                        isAdmin: false
                    },
                });
                res.status(201).json({message: "Utilisateur créé avec succès", user: newUser});
                next()
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            res.status(500).json({error: "Une erreur s'est produite lors de la création de l'utilisateur".errors});
        }
    },
    async sendMailRegister(req, res) {
        const { requestId } = await courier.send({
            message: {
                to: {
                    data: {
                        name: req.body.name,
                    },
                    email: req.body.email,
                },
                content: {
                    title: "Inscription Randox",
                    body: "Merci pour votre inscription {{name}}, cliquez sur ce lien : "+`${SITE_URL}`+"login  pour vous connecter à votre compte.",
                },
                routing: {
                    method: "single",
                    channels: ["email"],
                },
            },
        });
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;


            const errors = []

            if (!req.body.email) {
                errors.push("Merci d'entrer une adresse mail")
            }
            if (!req.body.password) {
                errors.push("Merci d'entrer un mot dde passe")
            }
            if (errors.length ) {
                return res.status(400).json({error: errors})
            } else {
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
            }
        } catch (error) {
            res.status(500).json({ error: "Une erreur s'est produite." });
        }
    },
    logout(req, res) {
        res.status(200).json({message: "Déconnexion réussie"});
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
    async updateMe(req, res){

    },

};
