const express = require("express");
const router = express.Router();
const {auth, authEmployer, restrictAccessTo} = require("../middleware/auth");
const JobController = require("../controllers/jobController");

/*
@route 			GET api/jobs
@description 	Get all available blog posts.
@access 		Public.
*/
router.get("/", JobController.fetchAllJobs);

/*
@route 			GET api/jobs/recommendation
@description 	Get recommended jobs based on keywords.
@access 		Private (auth needed).
*/
router.get("/recommendations", auth, JobController.RecommendJobs);


/*
@route 			GET api/jobs/:jobID
@description 	Get all available blog posts.
@access 		Public.
*/
router.get("/:jobID", JobController.fetchAJob);

/*
@route 			POST api/jobs
@description 	Create a new blog post.
@access 		Private (auth needed).
*/
router.post(
  "/",
  authEmployer,
  restrictAccessTo(["employer", "superAdmin"]),
  JobController.createJob
);

/*
@route 			DELETE api/jobs/:jobID
@description 	Delete a single blog post with given id.
@access 		Private (auth needed).
*/
router.delete("/:jobID", authEmployer, restrictAccessTo(["employer", "superAdmin"]), JobController.deleteOneJob);

/*
@route 			PUT api/jobs/:jobID
@description 	update a single blog post with given jobID.
@access 		Private (auth needed).
*/
router.put("/:jobID", authEmployer, restrictAccessTo(["employer", "superAdmin"]), JobController.updateOneJob);


module.exports = router;
