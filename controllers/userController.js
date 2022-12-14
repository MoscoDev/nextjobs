const Employer = require("../models/Employer");
const User = require("../models/User");
const QueryMethod = require("../utils/query");
const { response } = require("../utils/response");

exports.getAllUsers = async (req, res) => {
  try {
    const userQueries = new QueryMethod(User.find({}), req.query)
      .sort()
      .filter()
      .limit()
      .paginate();
    const allUsers = await userQueries.query;
    res.status(200).send(response({ allUsers }, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.getUsersByID = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).send(response({ err: "user not found" }, true));
    }
    res.status(200).send(response(user, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.updateUser = async (req, res) => {
  try {
    let userID = req.user.role === "applicant" ? req.user._id : req.params.id;
    const update = ({firstName,lastName,email,tel,location,state,experiences,skills,} = req.body);
   

    const user = await User.findByIdAndUpdate(userID, update, {
      new: true,
    });

    if (!user) {
      return res.status(404).send(response({ err: "user not found" }, true));
    }
    res.status(200).send(response(user, false));
  } catch (error) {
    console.log(error);
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let userID = req.user.role === "user" ? req.user._id : req.params.id;
    const deletedUser = await User.findByIdAndDelete(userID);
    if (!deletedUser)
      return res.status(400).send(response("cannot delete invalid user", true));
    res.status(200).send(response("account deleted successfully", true));
  } catch (error) {
    res.status(500).send(response(error.message, true));
  }
};
