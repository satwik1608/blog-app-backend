const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lioneljames123@gmail.com",
    pass: "satwik13",
  },
});

const emailSecret = process.env.EMAIL_SECRET || "Akshat is wow";

module.export = { transporter, emailSecret };
