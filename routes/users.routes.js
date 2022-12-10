const express = require("express");
const router = express.Router();
const { restrictAccessTo, auth } = require("../middleware/auth");
const {
  getAllUsers,
  getUsersByID,
  updateUser,
} = require("../controllers/userController");

/*
@route          GET api/users
@description    get user.
@access         Public
*/
router.get("/", auth, restrictAccessTo("superAdmin"), getAllUsers);

/*
@route          GET api/users/:userID
@description    get user.
@access         Public
*/
router.get("/:userID", getUsersByID);

/*
@route          PUT api/users/:userID
@description    get user.
@access         Public
*/
router.put(
  "/:userID",
  auth,
  restrictAccessTo(["user", "superAdmin"]),
  updateUser
);

module.exports = router;
