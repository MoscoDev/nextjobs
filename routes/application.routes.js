const uploader = require("../utils/uploads/multer");
const express = require("express");
const router = express.Router();
const { restrictAccessTo, authEmployer } = require("../middleware/auth");
const {createApplication
} = require("../controllers/applicationController");

/*
@route          GET api/employers
@description    get employer.
@access         Public
*/
// router.get("/", getAllEmployer);

// /*
// @route          GET api/employers/:employerID
// @description    get employer.
// @access         Public
// */
// router.get("/:employerID", getEmployerByID);

// /*
// @route          PUT api/employers/:employerID
// @description    get employer.
// @access         Public
// */
// router.put(
//   "/:employerID",
//   authEmployer,
//   restrictAccessTo(["employer", "superAdmin"]),
//   UpdateEmployer
// );

router.post(
  "/",
  authEmployer,
  restrictAccessTo(["employer", "superAdmin"]),
  uploader.single("file"),
  createApplication
);

module.exports = router;
