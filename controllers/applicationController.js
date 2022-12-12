const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const fs = require("fs/promises");
const sendEmail = require("../utils/emails/email");
const multer = require("multer");
const { response } = require("../utils/response");
const cloudinary = require("../utils/uploads/cloudinary");

exports.createApplication = async (req, res) => {
  try {
    const userID = req.user._id;
    const payload = ({ jobID, coverLetter } = req.body);

    const jobValid = await Job.findOne({ _id: jobID, isExpired: false });
    if (!jobValid) {
      return res.status(401).send(response("invalid job"));
    }

    // if user uploads a resume
    if (req.file) {
      // save on cloudinary
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        public_id: `${userID}`,
        resource_type: "raw",
      });
      // Save the resume & cover letter in the user's profile
      const updatedUser = await User.findByIdAndUpdate(
        userID,
        {
          resume: upload.secure_url,
        },
        { new: true }
      );
      fs.rm(req.file.path);
      console.log(upload);
      return res.json({
        success: updatedUser,
        file: upload.secure_url,
        
      });
    }

    let newApplication = await Application.create({
      ...payload,
      applicant: userID,
      employer: jobValid.employer,
      resume: upload.secure_url || req.user.resume || undefined,
    });

    if (!newApplication) {
      res.status(400).send(response("bad request", true));
    }
   await sendEmail({
      jobTitle: jobValid.title,
      name: req.user.firstName,
      type: "applicationSuccess",
      subject: "Thank you for your application",
      email: req.user.email,
      organization: jobValid.hiringFor,
    });
    res.status(200).send(response(newApplication, false));
  } catch (error) {
    console.log(error.message);
    res.status(500).send(response(error.message, true));
  }
};



exports.updateApplication = async(req,res)=>{
  const employerID = req.user._id
  const {applicationID} = req.params
  const {status} = req.query

  if(status === "shortliisted"||"rejected"){
    const updatedApplication = await Application.findByIdAndUpdate(applicationID, {
      status},{new:true});

       await sendEmail({
         jobTitle: jobValid.title,
         name: req.user.firstName,
         type: "applicationSuccess",
         subject: "Thank you for your application",
         email: req.user.email,
         organization: jobValid.hiringFor,
       });
  }
}