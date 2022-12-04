const express = require("express");
const router = express.Router();
const {registerNewEmployer} = require("../controllers/employerController");

/*
@route          POST api/employers
@description    Register a new employer.
@access         Public
*/
// router.post("/", registerNewEmployer);

module.exports = router;
