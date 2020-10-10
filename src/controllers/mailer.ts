import sgMail from '@sendgrid/mail'

require('dotenv').config()

sgMail.setApiKey('' + process.env.SENDGRID_API_KEY)

const sendToken = (username: string, email: string, token: string) => {
  return sgMail.send({
    dynamicTemplateData: {
      siteUrl: process.env.SITE_URL,
      token: token,
      username: username
    },
    from: 'me@dmitriy.icu',
    subject: 'Login link',
    templateId: 'd-a9275a4437bf4dd2b9e858f3a57f85d5',
    to: email
  })
}

export { sendToken }
