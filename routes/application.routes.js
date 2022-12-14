const uploader = require("../utils/uploads/multer");
const express = require("express");
const router = express.Router();
const { restrictAccessTo, authEmployer, auth } = require("../middleware/auth");
const {createApplication, updateApplication, getJobApplicationById, getAllJobApplicationsForAJob
} = require("../controllers/applicationController");

/*
@route          GET api/v1/:jobID
@description    get application.
@access         Private (employer)
*/
router.get("/:jobID",authEmployer, getAllJobApplicationsForAJob);

/*
@route          GET api/v1/applications/:applicationID
@description    get application.
@access         Private (user/applicant, employer)
*/
router.get("/application/:applicationID",auth||authEmployer, getJobApplicationById);

// /*
// @route          PUT api/v1/applications/:applicationID
// @description    get application.
// @access         Private (employer)
// */
router.put(
  "/:applicationID",
  authEmployer,
  restrictAccessTo(["employer", "superAdmin"]),
  updateApplication
);

/*
// @route          POST api/v1/applications/
// @description    get application.
// @access         Private (user/applicant)
// */
router.post(
  "/",
  auth,
  restrictAccessTo(["applicant", "superAdmin"]),
  uploader.single("file"),
  createApplication
);

module.exports = router;
