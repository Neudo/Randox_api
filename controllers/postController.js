const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config()

module.exports = {
    async create(req,res){
        let newPost
        try {
            const { title, short_desc, content, image } = req.body

            newPost = await prisma.post.create({
                data: {
                    title,
                    short_desc,
                    content,
                    image
                }
            })
            res.status(201).json({ message: "Post créé avec succès", post: newPost });
        } catch (error) {
            console.log("Erreur lors de la création du post", error)
            res.status(500).json({ error: "Une erreur s'est produite lors de la création du post"});
        }
    },
    async edit(req, res) {
        const postId = req.params.id;
        const { title, short_desc, content, image } = req.body;


        try {
            const updatedPost = await prisma.post.update({
                where: { id: parseInt(postId) },
                data: {
                    title,
                    short_desc,
                    content,
                    image
                }
            });

            res.json({ message: "Post édité avec succès", post: updatedPost });
        } catch (error) {
            console.log("Erreur lors de la modification du post", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la modification du post" });
        }
    },
    async deletePost(req, res) {
        const postId = req.params.id;

        try {
            const deletePost = await prisma.post.deleteMany({
                where: { id: parseInt(postId) },
            });
            res.json({ message: "Post supprimé"});
        } catch (error) {
            console.log("Erreur lors de la suppression du post", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la suppression du post" });
        }
    },
    async showAll(req, res){
        let allPosts
        try{
            allPosts =  await prisma.post.findMany()
            res.status(201).json({ message: "Voici la liste des posts : ", allPosts });
        } catch {
            console.log("Erreur lors de la récupération des posts", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des posts" });
        }
    },
    async showOne(req, res){
        const postId = req.params.id;
        try{
            const post =  await prisma.post.findMany({
                where: {id: parseInt(postId)}
            })
            res.status(201).json({ post });
        } catch {
            console.log("Erreur lors de la récupération du post", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération du post" });
        }
    }
};
