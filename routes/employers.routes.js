const express = require("express");
const router = express.Router();
const { restrictAccessTo, authEmployer } = require("../middleware/auth");
const {
  getAllEmployer,
  getEmployerByID,
  UpdateEmployer,
} = require("../controllers/employerController");

/*
@route          GET api/employers
@description    get employer.
@access         Public
*/
router.get("/", getAllEmployer);

/*
@route          GET api/employers/:employerID
@description    get employer.
@access         Public
*/
router.get("/:employerID", getEmployerByID);

/*
@route          PUT api/employers/:employerID
@description    get employer.
@access         Public
*/
router.put("/:employerID", authEmployer, restrictAccessTo(["employer","superAdmin"]), UpdateEmployer);

module.exports = router;
