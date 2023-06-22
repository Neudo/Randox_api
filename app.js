const express = require('express')
let cors = require('cors')
require('dotenv').config()
const {STRIPE_KEY, SITE_URL} = process.env
const stripe = require('stripe')(`${STRIPE_KEY}`);
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
module.exports = { db };

const app = express()
app.use(express.static('public'));
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000


const authRouter = require('./routers/authRouter').router
const postRouter = require('./routers/postRouter').router
const planRouter = require('./routers/planRouter').router
const contactRouter = require('./routers/contactRouter').router
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/plan', planRouter)
app.use('/contact', contactRouter)

// app.post('/checkout', async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price: req.body.price,
//                 quantity: 1,
//             },
//         ],
//         mode: 'subscription',
//         success_url: `${SITE_URL}/success.html`,
//         cancel_url: `${SITE_URL}/cancel.html`,
//     });
//
//     res.redirect(303, session.url);
// });

app.post('/checkout', async (req, res) => {
    const prices = await stripe.prices.list({
        lookup_keys: [req.body.lookup_key],
        expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: [
            {
                price: prices.data[0].id,
                // For metered billing, do not pass quantity
                quantity: 1,

            },
        ],
        mode: 'subscription',
        success_url: `${SITE_URL}/success.html`,
        cancel_url: `${SITE_URL}/cancel.html`,
    });

    res.redirect(303, session.url);
});


db.$connect()
    .then(
        () => console.log('Prisma connected to database !'))
    .catch((err) => console.log(err))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

