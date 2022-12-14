const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("../utils/response");
const { Validation } = require("../utils/validation");
const sendEmail = require("../utils/emails/email");
const {Employer} = require("../models/Employer");
const Organization = require("../models/Organization");

/*
@description authenticate the user.
*/
exports.authenticateUser = (req, res) => {
  const { email, password } = req.body;

  // validate
  if (!email || !password) {
    return res.status(400).json({ message: "Please, enter all fields." });
  }

  // check for existing user with username
  User.findOne({ email }).select("+password").then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    } else {
      // validate password
      
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials." });
        
        const { _id, role, isVerified } = user;
        const verificationLink = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/verify/${_id}`;
       
        if (!isVerified){
          return res
            .status(422)
            .json(
              response(
                { err: "please verify this email: " + verificationLink },
                true
              )
            )}
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: (process.env.TOKEN_EXPIRATION_TIME),
      });
      res.header("auth-token", token).send({ token });
      });
    }
  });
};


/*
@description authenticate the employer.
*/
exports.authenticateEmployer = (req, res) => {
  const { email, password } = req.body;

  // validate
  if (!email || !password) {
    return res.status(400).json({ message: "Please, enter all fields." });
  }

  // check for existing employer with email
  Employer.findOne({ email }).select("+password").then((employer) => {
    if (!employer) {
      return res.status(401).json({ message: "Invalid credentials." });
    } else {
      // validate password
      
      bcrypt.compare(password, employer.password).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials." });
        
        const { _id, role, isVerified } = employer;
        const verificationLink = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/employer/verify/${_id}`;
       
        if (!isVerified){
          return res
            .status(422)
            .json(
              response(
                { err: "please verify this email: " + verificationLink },
                true
              )
            )}
      const token = jwt.sign({ _id: employer._id }, process.env.JWT_SECRET, {
        expiresIn: (process.env.TOKEN_EXPIRATION_TIME),
      });
      res.header("auth-token", token).send({ token });
      });
    }
  });
};




/*
@description register the user as an applicant.
*/
exports.registerNewUser = async (req, res) => {
  try {
    // validate reqBody
    const { firstName, lastName, email, tel, password, country, state } =
      req.body;
    const { error } = Validation({ firstName, lastName, email, password });
    if (error)
      return res
        .status(400)
        .send(
          response({ error: true, message: error?.details[0].message }),
          error
        );

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(409)
        .send(response({ error: true, message: "Email already exist" }, true));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      tel,
      password: hashedPassword,
      location: { country, state },
    });

    const savedUser = await user.save();
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify/${savedUser._id}`;
    await sendEmail({
      name: firstName,
      verificationLink,
      type: "verification",
      subject: "Verification Email",
      email,
    });
    res.status(200).send(
      response(
        {
          email: savedUser.email,
          _id: savedUser._id,
        },
        false
      )
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(response({ err: err.message }, err));
  }
};

/*
@description register an employer.
*/
exports.registerNewEmployer = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      tel,
      password,
      organizationName,
      organizationTel,
      size,
      country,
      website,
      state,
      role,
      about,logo
    } = req.body;

    // validate reqBody
    const { error } = Validation({
      firstName,
      lastName,
      email,
      password,
      organizationName,
      size,
      country,
      logo,
      website,
      state,
      
    });
    if (error)
      return res
        .status(400)
        .send(
          response({ error: true, message: error?.details[0].message }, error)
        );

    // check for duplicate in employer and Organization DB

    const employerExist = await Employer.findOne({ email });
     if (employerExist)
       return res
         .status(409)
         .send(response({ error: true, message: "Email already exist" }, true));
    let organizationExist = await Organization.findOne({
      name:organizationName
    });
   
    if (!organizationExist){
       const sizeOptions = ["1 - 10", "11 - 100", "above 100"];

       size =
         size <= 10
           ? sizeOptions[0]
           : size > 10 && size <= 100
           ? sizeOptions[1]
           : sizeOptions[2];
       organizationExist = await Organization.create({
         name: organizationName,
         tel: organizationTel,
         location: { country, state },
         size,
         logo,
         about,
         website,
       });
    }
      

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
   
    // create the Employer Entity
    const employer = new Employer({
      firstName,
      lastName,
      email,
      tel,
      role,
      password: hashedPassword,
      organization: organizationExist._id,
    });

    const savedEmployer = await employer.save();
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify/${savedEmployer._id}`;

    // Send EMPLOYER verification email
    await sendEmail({
      name: employer.firstName,
      verificationLink,
      type: "employerVerification",
      subject: "Employer Account Verification",
      email,
      organization: organizationExist.name,
    });
    res.status(200).send(
      response(
        {
          email: savedEmployer.email,
          _id: savedEmployer._id,
        },
        false
      )
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(response({ err: err.message }, err));
  }
};

/*
@description 	Get authenticated user data.
*/
exports.fetchAuthenticatedUser = (req, res) => {
  User.findById(req.user.id) // user id is gotten from the auth decoded token
    .select("-password") // removes the password from the selection
    .then((user) => res.json(user));
};

/*
@description 	Verify the user account.
*/
exports.verifyUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const verifyUser = await User.findByIdAndUpdate(
      _id,
      { isVerified: true },
      { new: true }
    );
    if (!verifyUser)
      return res
        .status(404)
        .send(response({ err: "this user account does not exist" }));
    if (verifyUser.isVerified)
          return res
            .status(404)
            .send(response({ err: "this user account does not exist" }));
    return res
      .status(200)
      .send(response({ email: verifyUser.email, _id: verifyUser._id , message: "verification successful"}));
  } catch (error) {
    return res.status(500).send(response({ err: error.message }));
  }
};

/*
@description 	Verify the Employer account.
*/
exports.verifyEmployer = async (req, res) => {
  try {
    const {employerID} = req.params;
    console.log(employerID)
    const verifyEmployer = await Employer.findByIdAndUpdate(
      employerID,
      { isVerified: true },
      { new: true }
    );
    if (!verifyEmployer)
      return res
        .status(404)
        .send(response({ err: "this Employer account does not exist" }));
    return res
      .status(200)
      .send(response({ email: verifyEmployer.email, _id: verifyEmployer._id }));
  } catch (error) {
    return res.status(500).send(response({ err: error.message }));
  }
};

/* @description 	restrict access to */

