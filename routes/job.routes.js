const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const JobController = require("../controllers/jobController");

/*
@route 			GET api/jobs
@description 	Get all available blog posts.
@access 		Public.
*/
router.get("/", JobController.fetchAllJobs);

/*
@route 			POST api/jobs
@description 	Create a new blog post.
@access 		Private (auth needed).
*/
router.post("/", auth, JobController.createJob);

/*
@route 			DELETE api/jobs/:id
@description 	Delete a single blog post with given id.
@access 		Private (auth needed).
*/
router.delete("/:id", auth, JobController.deleteOnePost);

/*
@route 			PUT api/jobs/:id
@description 	update a single blog post with given id.
@access 		Private (auth needed).
*/
router.put("/:id", auth, JobController.updateOnePost);

module.exports = router;
