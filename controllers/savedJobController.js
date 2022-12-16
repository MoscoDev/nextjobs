const Job = require("../models/Job");
const SavedJob = require("../models/SavedJob");
const QueryMethod = require("../utils/query");
const { response } = require("../utils/response");

const saveAJob = async (req, res) => {
  const { jobID } = req.params;
  const userID = req.user._id;
  const jobAlreadySaved = await SavedJob.findOne({
    job: jobID,
    user: userID,
  });
  if (jobAlreadySaved) {
    return res.status(409).send(response("already saved this Job",true));
  }
  console.log(jobID)
//   check job validity
const jobValid = await Job.findOne({_id:jobID,isExpired:false})
if(!jobValid) return res.status(400).send(response("this job has expired",true))
  let newSavedJob = new SavedJob({ job: jobID, user: userID });
  await newSavedJob.save();
  if (newSavedJob) {
    return res.status(200).send(response(newSavedJob));
  } else {
    return res.status(400).send(response("bad request"),true);
  }
};

const getSavedJobs = async (req, res) => {
  const userID = req.user._id;
  const SavedJobs = new QueryMethod( SavedJob.find({
    user: userID,
  }).populate("job").populate("user"), req.query);
  if (SavedJobs) {
    return res.status(200).send(response(await SavedJobs.query));
  } else {
    return res.status(400).send(response("bad request", true));
  }
};

const deleteAsavedJob = async (req, res) => {
  const { jobID } = req.params;
  const userID = req.user._id;
  const deletedSavedJob = await SavedJob.findOneAndDelete({
    job: jobID,
    user: userID,
  });
  if (!deletedSavedJob)
    return res.status(404).send(response("savedjob not found",true));
  return res.status(204).send(response(deletedSavedJob));
};

module.exports = { saveAJob, getSavedJobs, deleteAsavedJob };
