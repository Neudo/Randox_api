const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config()

module.exports = {
    async create(req,res){
        console.log("req.user", req.user.userId)
        let newPost
        try {
            const { title, short_desc, content, image, slug } = req.body

            newPost = await prisma.post.create({
                data: {
                    title,
                    short_desc,
                    slug,
                    content,
                    image,
                    author: req.user.name,
                    publied: true
                }
            })

            const error = []
            if ((title.length <= 0) || (short_desc.length <= 0) || (content.length <= 0) || (image.length <= 0)) {
                error.push("Merci de remplir tous les champs !")
            }
            // const existingSlug = await prisma.post.findFirst({where: slug});
            // if (existingSlug){
            //     error.push("Slug déjà pris pour un autre article ! Merci d'en choisir un autre")
            // }

            if(error.length === 0 ){
                res.status(201).json({ message: "Post créé avec succès", post: newPost });
            } else {
                res.status(400).json({message: error})
            }
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
            const error = []
            if ((title.length <= 0) || (short_desc.length <= 0) || (content.length <= 0) || (image.length <= 0)) {
                error.push("Merci de remplir tous les champs !")
            }

            if(error.length === 0 ){
                res.status(201).json({ message: "Post édité avec succès", post: updatedPost });
            } else {
                res.status(400).json({message: error})
            }
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
            res.status(201).json(allPosts);
        } catch {
            console.log("Erreur lors de la récupération des posts");
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des posts" });
        }
    },
    async showOne(req, res){
        const postSlug = req.params.id;
        let post
        try{
            post =  await prisma.post.findMany({
                where: {slug: postSlug}
            })
            res.status(201).json({ post });
        } catch {
            console.log("Erreur lors de la récupération du post");
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération du post" });
        }
    }
};
