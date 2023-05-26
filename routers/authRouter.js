const express = require('express')
const {register, login, logout, me} = require ('../controllers/authController')
const {authMiddleware} = require ('../middlewares/authMiddleware')
exports.router = (()=>{
    const authRouter = express.Router()
    authRouter.route('/signup/').post(register)
    authRouter.route('/login/').post(login)
    authRouter.route('/logout/').post(logout)
    authRouter.route('/me/').get( authMiddleware, me)
    return authRouter
})()


