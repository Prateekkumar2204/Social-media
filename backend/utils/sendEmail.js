const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'pramoddubey740@gmail.com',      // your gmail
    pass: 'jyrl yfwa qrmj fqbd'       // app password
  }
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"College App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
