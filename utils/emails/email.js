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
  applicationSuccess: `
Hi ${options.name} ,\
\n
Thank you for applying to the ${options.jobTitle} position at ${options.organization}.\
\n
I’d like to inform you that we received your application. Our hiring team is currently reviewing all applications and we are planning to schedule interviews in the next two weeks. If you are among qualified candidates, you will receive email from our one of our recruiters to schedule an interview. In any case, we will keep you posted on the status of your application.\
\n
Thank you, again, for taking the time to apply to this role at ${options.organization}\
\n
Best regards,\
\n
Hiring Team\n
${options.organization}`,
  rejected: `Dear ${options.name},\
\n
Thank you for your interest in ${options.organization} and the ${options.jobTitle} role for which you applied. We've reviewed your qualifications, and we are pursuing other candidates with more experience and industry knowledge.\
\n
The hiring committee appreciates your application and the time you invested in it. We encourage you to apply for openings in our organization that you qualify for in the future.\
\n
Good luck with your future endeavors.\
\n
Sincerely,\n
${options.organization}\n
Hiring Team`,
  shortlisted: `Hi ${options.name},\
\n
Thank you for interest in working at ${options.organization}.\
\n
I would like to discuss your application for the ${
    options.jobTitle
  } role and tell you more about ${options.organization}.\
\n
Would you be available for a short introductory phone call ${new Date(
    new Date().getTime() + 2 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  })}\
\n
Looking forward to hearing from you,\
\n
Sincerely,\n
${options.organization}\n
Hiring Team`,
};
  const transporter = nodemailer.createTransport({
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

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`email sent:${info.response}`);
    }
  });
};

module.exports = sendEmail;
