const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = { sendEmail };

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const emailSecret = process.env.EMAIL_SECRET || "Akshat is wow";

async function sendEmail({ user, email }) {
  try {
    const emailToken = jwt.sign(
      {
        user: user,
      },
      emailSecret,
      {
        expiresIn: "1d",
      }
    );

    const urlT = "https://shiny-ox-leotard.cyclic.app";
    // const urlT = "http:///localhost:1337";

    const url = `${urlT}/confirmation/${emailToken}`;

    await transporter.sendMail({
      from: "Satwik , <lioneljames123@gmail.com>",
      to: email,
      subject:
        "Sorry for this, all thanks to my tall ECE friend from Madhya Pradesh",
      html: ` To confirm the email click on this goddamn link : <a href="${url}">Verify</a>`,
    });
  } catch (ex) {
    console.log(ex);
  }
}
