const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'sahaj6463@gmail.com',      // your gmail
    pass: 'zgur tgmy xgoo vbuc'       // app password
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
