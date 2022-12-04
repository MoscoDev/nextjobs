const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const template = {
    verification: `
Hi ${options.name},

Thanks for getting started with Nextjobs!

We need a little more information to complete your registration, including a confirmation of your email address.

Click below to confirm your email address:

${options.verificationLink}

If you have problems, please paste the above URL into your web browser.`,
    employerVerification: `
Hi ${options.name},

Thanks to ${options.organization} for getting started with Nextjobs!

We need a little more information to complete your registration, including a confirmation of your email address.

Click below to confirm your email address:

${options.verificationLink}

If you have problems, please paste the above URL into your web browser.`,
  };

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: template[`${options.type}`],
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
