const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config()

module.exports = {
    async create(req,res){
        let newPlan
        try {
            const { title, info, price, stripe_id } = req.body

            newPlan = await prisma.plan.create({
                data: {
                    title,
                    info,
                    price,
                    stripe_id
                }
            })
            res.status(201).json({ message: "Plan créé avec succès", plan: newPlan });
        } catch (error) {
            console.log("Erreur lors de la création du plan", error)
            res.status(500).json({ error: "Une erreur s'est produite lors de la création du plan"});
        }
    },
    async edit(req, res) {
        const planId = req.params.id;
        const { title, info, price, stripe_id } = req.body;
        try {
            const updatedPlan = await prisma.plan.update({
                where: { id: parseInt(planId) },
                data: {
                    title,
                    info,
                    price,
                    stripe_id
                }
            });

            res.json({ message: "Plan édité avec succès", plan: updatedPlan });
        } catch (error) {
            console.log("Erreur lors de la modification du plan", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la modification du plan" });
        }
    },
    async deletePlan(req, res) {
        const planId = req.params.id;

        try {
            const deletePlan = await prisma.plan.deleteMany({
                where: { id: parseInt(planId) },
            });
            res.json({ message: "Plan supprimé"});
        } catch (error) {
            console.log("Erreur lors de la suppression du plan", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la suppression du plan" });
        }
    },
    async showAll(req, res){
        let allPlans
        try{
            allPlans =  await prisma.plan.findMany()
            res.status(201).json({ message: "Voici la liste des plans : ", allPlans });
        } catch {
            console.log("Erreur lors de la récupération des posts", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des posts" });
        }
    },

};
