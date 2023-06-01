const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
module.exports = { db };

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000



const authRouter = require('./routers/authRouter').router
const postRouter = require('./routers/postRouter').router
const planRouter = require('./routers/planRouter').router
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/plan', planRouter)




app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

