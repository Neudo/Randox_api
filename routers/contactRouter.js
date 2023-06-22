const express = require('express')
const {sendContactMail} = require ('../controllers/contactController')
const {authMiddleware} = require ('../middlewares/authMiddleware')

exports.router = (()=>{
    const postRouter = express.Router()
    postRouter.route('/').post(sendContactMail)
    return postRouter
})()

