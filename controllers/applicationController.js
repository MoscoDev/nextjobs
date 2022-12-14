const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const fs = require("fs/promises");
const sendEmail = require("../utils/emails/email");
const multer = require("multer");
const { response } = require("../utils/response");
const cloudinary = require("../utils/uploads/cloudinary");
const QueryMethod = require("../utils/query");

exports.createApplication = async (req, res) => {
  try {
    const userID = req.user._id;
    const payload = ({ jobID, coverLetter } = req.body);
    
    const jobValid = await Job.findOne({
      _id: req.body.jobID,
      isExpired: false,
    });
    if (!jobValid) {
      return res.status(401).send(response("invalid job",true));
    }
    const appliedBefore = await Application.findOne({ applicant: userID });
    if (appliedBefore) {
      return res.status(409).send(response("you've applied to this job before",true ));
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
          resume: upload?.secure_url,
        },
        { new: true }
      );
      fs.rm(req.file.path);
    
      
    let newApplication = await Application.create({
      ...payload,
      applicant: userID,
      employer: jobValid.employer,
      resume: upload.secure_url,
      job: jobValid._id
    });

    if (!newApplication) {
      res.status(400).send(response("bad request", true));
    }
    sendEmail({
      jobTitle: jobValid.title,
      name: req.user.firstName,
      type: "applicationSuccess",
      subject: "Thank you for your application",
      email: req.user.email,
      organization: jobValid.hiringFor,
    });
    res.status(200).send(response(newApplication, false));
    }else{
      let newApplication = await Application.create({
      ...payload,
      applicant: userID,
      employer: jobValid.employer,
      resume: "" 
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
    }

    

  } catch (error) {
    console.log(error);
    res.status(500).send(response(error, true));
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const employerID = req.user._id;
    const { applicationID } = req.params;
    const { status } = req.query;

    if (status === "shortliisted" || "rejected") {
      const updatedApplication = await Application.findByIdAndUpdate(
        applicationID,
        {
          status,
        },
        { new: true }
      )
        .populate("applicant", "firstName email")
        .populate("job", "title hiringFor");

      await sendEmail({
        jobTitle: updatedApplication.job.title,
        name: updatedApplication.applicant.firstName,
        type: status,
        subject:
          status === "shortlisted"
            ? `Your Application to ${updatedApplication.job.hiringFor} – Phone Interview Invitation`
            : "Application Status Update",
        email: updatedApplication.applicant.email,
        organization: updatedApplication.job.hiringFor,
      });
      res.status(200).send(
        response(
          {
            message: `application status update to ${status}`,
            updatedApplication,
          },
          false
        )
      );
    } else {
      return res.status(400).send(response("invalid request", true));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response("something went wrong", true));
  }
};

exports.getAllJobApplicationsForAJob = async (req, res) => {
  try {
    const employerID = req.user._id;
    console.log(req.user)
    const { jobID } = req.params;
    const queriedallApllicationsForTheJob = new QueryMethod(
      Application.find({ employer: employerID, job:jobID}),
      req.query
    )
      .sort()
      .filter()
      .limit()
      .paginate();
    const allApllicationsForTheJob =
      await queriedallApllicationsForTheJob.query;
    if (!allApllicationsForTheJob) {
      return res.status(404).send(response("Application not found", true));
    }
    res.status(200).send(response(allApllicationsForTheJob, false));
  } catch (error) {
    console.log(error);
    return res.status(500).send(response("something went wrong", true));
  }
};

exports.getJobApplicationById = async (req, res) => {
  try {
    const { applicationID } = req.params;
    const application = await Application.findById(applicationID);
    if (!application) {
      return res.status(404).send(response("Application not found", true));
    }
    res.status(200).send(response(application, false));
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(response("something went wrong", true));
  }
};

exports.userDeleteJobApplication = async (req, res) => {
  try {
    const { applicationID } = req.params;
    const application = await Application.findOneAndDelete({
      _id: applicationID,
      applicant: req.user._id,
    });
    if (!application) {
      return res.status(404).send(response("Application not found", true));
    }
    res.status(204).send(response("application deleted", false));
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(response("something went wrong", true));
  }
};
