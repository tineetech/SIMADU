import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import dotenv from "dotenv";
dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000,
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const templatePath = path.resolve(__dirname, "../templates/verify.hbs");
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(source);

    const html = template({
      link: `${process.env.BASE_URL_FE}/verification/register/${token}`,
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Verify Youre Email Address",
      html,
      attachments: [
        {
          filename: "LIT.png",
          path: path.resolve(__dirname, "../../public/LIT.png"),
          cid: "logo",
        },
      ],
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

export const sendResetPassEmail = async (email, token) => {
  try {
    const templatePath = path.resolve(__dirname, "../templates/resetpass.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);

    const html = compiledTemplate({
      link: `${process.env.BASE_URL_FE}/verification/reset-password/${token}`,
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset your password",
      html,
      attachments: [
        {
          filename: "LIT.png",
          path: path.resolve(__dirname, "../../public/LIT.png"),
          cid: "logo",
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

export const sendReverificationEmail = async (email, token) => {
  try {
    const templatePath = path.resolve(__dirname, "../templates/reverification.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate({
      link: `${process.env.BASE_URL_FRONTEND}/reverify/${token}`,
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Changing email address",
      html,
    });
  } catch (error) {
    throw error;
  }
};
