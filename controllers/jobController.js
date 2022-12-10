const { date } = require("joi");
const { find } = require("../models/Job");
const Job = require("../models/Job");
const Organization = require("../models/Organization");
const QueryMethod = require("../utils/query");
const { response } = require("../utils/response");

/*
@description 	Get all available blog posts.
*/
exports.fetchAllJobs = async (req, res) => {
  try {
    const jobQueries = new QueryMethod(
      Job.find({ isExpired: false }).populate("organization"),
      req.query
    )
      .sort()
      .filter()
      .limit()
      .paginate();
    const allJobs = await jobQueries.query;
    res.status(200).send(response(allJobs, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

/* @description 	Get a available blog posts.
 */
exports.fetchAJob = async (req, res) => {
  try {
    const { jobID } = req.params;
    const job = await Job.findById(jobID);

    if (!job) return res.status(404).send(response("job not found", true));
    res.status(200).send(response(job, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

/*
@description 	Create a new blog post.
*/
exports.createJob = async (req, res) => {
  try {
    const payload = ({
      description,
      organization,
      expiresAt,
      JobType,
      keywords,
      seniority,
      title,
      industry,
      requirements,
      salary,
      location,
    } = req.body);
    let organizationExist = await Organization.findOne({
      name: organization,
    });
    if (!organizationExist) {
      organizationExist = req.user.organization;
      
    }
    let hiringFor = organization;
    const job = new Job({
      ...payload,
      employer: req.user._id,
      organization: organizationExist._id,
      hiringFor,
    });
    const newJob = await job.save();
    if (newJob) {
      res.status(200).send(response(newJob, false));
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(response(error.message, true));
  }
};

/* 
@description 	Delete a single blog post with given id.
*/
exports.deleteOneJob = async (req, res) => {
  try {
    let { jobID } = req.params;
    const update = req.body;
    const role = req.user.role;
    const job =
      role === "employer"
        ? await Job.findOneAndDelete({ _id: jobID, employer: req.user._id })
        : Job.findOneAndDelete({ _id: jobID });

    if (!job) {
      return res.status(404).send(response({ err: "job not found" }, true));
    }
    res.status(200).send(response({ job }, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

/* 
@description 	Update a single blog post with given id.
*/
exports.updateOneJob = async (req, res) => {
  try {
    let { jobID } = req.params;
    const update = req.body;
    const role = req.user.role;
    const job =
      role === "employer"
        ? await Job.findOneAndUpdate(
            { _id: jobID, employer: req.user._id },
            update,
            {
              new: true,
            }
          )
        : Job.findOneAndUpdate({ _id: jobID }, update, {
            new: true,
          });

    if (!job) {
      return res.status(404).send(response({ err: "job not found" }, true));
    }
    res.status(200).send(response({ job }, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

/* 
@description 	Update a jobs that expirydate has passed.
*/

exports.ExpireAJob = async (req, res) => {
  let triesCounter = 0;
  while (triesCounter < 1) {
    try {
      const findJobsToExpire = await Job.updateMany(
        { expiresAt: { $lte: Date.now() } },
        { isExpired: true }
      );
      if (findJobsToExpire.matchedCount < 1) {
        return console.log("no job has expired");
      }

      console.log({ findJobsToExpire, message: "are expired" });
      break;
    } catch (error) {
      console.log(error);
    }
  }
  triesCounter++;
};
