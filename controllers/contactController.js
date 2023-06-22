const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {CourierClient} = require("@trycourier/courier");
const {JWT_ACCESS_SECRET, API_KEY, SITE_URL} = process.env
const courier = CourierClient({ authorizationToken: `${API_KEY}` });

require('dotenv').config()

module.exports = {
 async sendContactMail(req, res) {
  const { requestId } = await courier.send({
   message: {
    to: {
     data: {
      subject: req.body.subject,
      message: req.body.content,
      from: req.body.email,

     },
     email: 'bassalair.quentin@gmail.com',
    },
    content: {
     title: "Nouveau mail !",
     body: "Vous avez reçu un nouveau mail via le formulaire de contact, de la part de {{from}} " + '\r\n' +
         'Sujet : {{subject}}' + '\r\n' +
         'Message : {{message}}',
    },
    routing: {
     method: "single",
     channels: ["email"],
    },
   },
  });
 },

};
