const express = require("express");
const { saveAJob, deleteAsavedJob, getSavedJobs } = require("../controllers/savedJobController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.route("/:jobID/").post(auth, saveAJob).delete(auth, deleteAsavedJob);
router.route("/").get(auth, getSavedJobs);

module.exports = router;
