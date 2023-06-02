const express = require('express')
const {create,edit,showAll, deletePlan} = require ('../controllers/planController')
const {authMiddleware} = require ('../middlewares/authMiddleware')

exports.router = (()=>{
    const planRouter = express.Router()
    planRouter.route('/create').post( authMiddleware, create)
    planRouter.route('/edit/:id').post( authMiddleware, edit)
    planRouter.route('/delete/:id').delete( authMiddleware, deletePlan)
    planRouter.route('/').get(showAll)
    return planRouter
})()

