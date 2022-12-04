const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("../utils/response");
const {Validation} = require("../utils/validation");
const sendEmail = require("../utils/emails/email");


