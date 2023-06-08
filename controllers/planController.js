const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config()

module.exports = {
    async create(req,res){
        let newPlan
        try {
            const { title, info, price,image, stripe_id } = req.body

            newPlan = await prisma.plan.create({
                data: {
                    title,
                    info,
                    price,
                    image,
                    stripe_id
                }
            })

            const error = []
            if ((title.length <= 0) || (info.length <= 0) || (price.length <= 0) || (image.length <= 0)) {
                error.push("Merci de remplir tous les champs")
            }
            if(error.length === 0 ){
                res.status(201).json({ message: "Post créé avec succès", plan: newPlan });
            } else {
                res.status(400).json({message: error})
            }
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
            res.status(201).json(allPlans);
        } catch {
            console.log("Erreur lors de la récupération des posts");
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des posts" });
        }
    },
};
