const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailEthereal = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.TEST_ACCOUNT,
      pass: process.env.TEST_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Shaw" <shawlu95@gmail.com>',
    to: 'shawlu95@126.com',
    subject: 'Hello',
    html: '<h2>Sending Emails with Node.js</h2>',
  });

  res.json(info);
}

const sendEmail = async (req, res) => {
  const msg = {
    to: 'shawlu95@gmail.com', // Change to your recipient
    from: 'mementos.nft@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg)
    .then(() => {
      res.status(200).send('Email sent');
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
}
module.exports = sendEmail;