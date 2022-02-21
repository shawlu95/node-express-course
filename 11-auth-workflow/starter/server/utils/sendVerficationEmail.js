const sendEmail = require('./sendEmail');

// origin is server url
const sendVerificationEmail = async ({ name, email, verificationToken, origin }) => {
  // when the link is opened at front-end, 
  // a post request will be sent to backend to verify email
  const link = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const html = `<h4>Hello, ${name}</h4><p>Please verify your email <a href="${link}">here</a>.</p>`;
  const subject = "Email Confirmation";
  sendEmail({ to: email, subject, html });
};

module.exports = sendVerificationEmail;