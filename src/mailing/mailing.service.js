import enviroment from "../config/enviroment.js";
import nodemailer from "nodemailer";

export default class MailingService {
  constructor() {
    this.client = nodemailer.createTransport({
      service: enviroment.MAIL_SERVICE,
      port: 587,
      auth: {
        user: enviroment.MAIL_USER,
        pass: enviroment.MAIL_PASS,
      },
    });
  }

  async sendMail({ from, to, subject, html, attachments = [] }) {
    const mailOptions = {
      from,
      to,
      subject,
      html,
      attachments,
    };
    const result = await this.client.sendMail(mailOptions);
    console.log(result);
    return result;
  }
}
