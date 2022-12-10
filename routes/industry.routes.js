const express = require("express");
const router = express.Router();
const { restrictAccessTo, authEmployer } = require("../middleware/auth");
const {
  getAllIndustry,
  getAnIndustryByID,
  updateAnIndustryByID,createIndustry,createManyIndustry,deleteAnIndustryByID
} = require("../controllers/industryController");

/*
@route          POST api/industry
@description    get employer.
@access         Public
*/
router.post("/", createIndustry);

/*
@route          POST api/industry
@description    get employer.
@access         Public
*/
router.post("/many", createManyIndustry);


/*
@route          GET api/industry
@description    get employer.
@access         Public
*/
router.get("/", getAllIndustry);

/*
@route          GET api/industry/:industryID
@description    get industry.
@access         Public
*/
router.get("/:industryID", getAnIndustryByID);

/*
@route          PUT api/industry/:industryID
@description    get industry.
@access         Public
*/
router.put(
  "/:industryID", updateAnIndustryByID
);

module.exports = router;
