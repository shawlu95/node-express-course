const nodemailer = require('nodemailer');
const nodeMailerConfig = require('./nodemailerConfig');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return await transporter.sendMail({
    from: '"Apple" <apple@icloud.com>', // sender address
    to, subject, html
  });
}

// const sendEmail = async (req, res) => {
//   const msg = {
//     to: 'shawlu95@gmail.com', // Change to your recipient
//     from: 'mementos.nft@gmail.com', // Change to your verified sender
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };
//   sgMail.send(msg)
//     .then(() => {
//       res.status(200).send('Email sent');
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).end();
//     });
// }
module.exports = sendEmail;