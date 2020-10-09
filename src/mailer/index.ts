import sgMail from "@sendgrid/mail"

require("dotenv").config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const sendToken = (username: string, email: string, token: string) => {
  return sgMail.send({
    from: "me@dmitriy.icu",
    to: email,
    subject: "Login link",
    templateId: "d-a9275a4437bf4dd2b9e858f3a57f85d5",
    dynamicTemplateData: {
      username: username,
      siteUrl: process.env.SITE_URL,
      token: token,
    },
  })
}

export { sendToken }
