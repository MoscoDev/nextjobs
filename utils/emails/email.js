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
    applicationSucces: `
Hi ${options.name} ,\
Thank you for applying to the ${options.jobTitle} position at ${options.organization}.\
I’d like to inform you that we received your application. Our hiring team is currently reviewing all applications and we are planning to schedule interviews in the next two weeks. If you are among qualified candidates, you will receive email from our one of our recruiters to schedule an interview. In any case, we will keep you posted on the status of your application.\
Thank you, again, for taking the time to apply to this role at ${options.organization}\
Best regards,\
Hiring Team\
${options.organization}`,
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

  transporter.sendMail(mailOptions, (err, info)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log(`email sent:${info.response}`)
    }
  });
};

module.exports = sendEmail;
