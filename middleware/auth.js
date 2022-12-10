const jwt = require("jsonwebtoken");
const {Employer} = require("../models/Employer");
const User = require("../models/User");
const { response } = require("../utils/response");

exports.auth = async (req, res, next) => {
  try {
    const token = req?.headers["authorization"].split(" ")[1];
    // check for token
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorisation denied." });

    //if there is a token, then verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //add the user from payload
    req.user = (await User.findById(decoded._id)) || next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid." });
  }
};
exports.authEmployer = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  // check for token
  if (!token)
    return res.status(401).json({ message: "No token, authorisation denied." });

  try {
    //if there is a token, then verify
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //add the user from payload
    req.user = await Employer.findById(decoded._id);
    
    next();
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Token is not valid." });
  }
};

exports.restrictAccessTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send(response("You are not authorised to perform this action.", true));
    }
    
    next();
  };
};
