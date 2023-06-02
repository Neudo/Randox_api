const express = require('express')
const {create,edit,showAll, showOne, deletePost} = require ('../controllers/postController')
const {authMiddleware} = require ('../middlewares/authMiddleware')

exports.router = (()=>{
    const postRouter = express.Router()
    postRouter.route('/create/').post( authMiddleware, create)
    postRouter.route('/edit/:id').post( authMiddleware, edit)
    postRouter.route('/delete/:id').delete( authMiddleware, deletePost)
    postRouter.route('/').get(showAll)
    postRouter.route('/:id').get(showOne)
    return postRouter
})()

