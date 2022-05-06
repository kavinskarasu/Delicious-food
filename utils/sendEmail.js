const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const ejs = require("ejs");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `kaviarasu <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kaviarasu.ct20@bitsathy.ac.in",
        pass: "hackerearth@12345",
      },
    });
  }
  async send(templete, subject) {
    const html = await ejs.renderFile(
      `${__dirname}/../views/email/${templete}.ejs`,
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,

      // html:
    };

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    this.send("welcome", "Welcome to Delicious Family!");
  }
};
