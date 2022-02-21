const sendEmail = require('./sendEmail');

// origin is server url
const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  // when the link is opened at front-end, 
  // a post request will be sent to backend to reset email
  const link = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const html = `<h4>Hello, ${name}</h4><p>Please reset your password <a href="${link}">here</a>.</p>`;
  const subject = "Reset Password";
  sendEmail({ to: email, subject, html });
};

module.exports = sendResetPasswordEmail;