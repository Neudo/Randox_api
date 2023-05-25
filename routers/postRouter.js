const express = require('express')
const {create,edit,showLatest, deletePost} = require ('../controllers/postController')
exports.router = (()=>{
    const authRouter = express.Router()
    authRouter.route('/signup/').post(register)
    return authRouter
})()


