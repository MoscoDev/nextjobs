const {Employer} = require("../models/Employer");
const QueryMethod = require("../utils/query");
const { response } = require("../utils/response");

exports.getAllEmployer = async (req, res) => {
  try {
    const queriedEmployers = new QueryMethod(Employer.find({}), req.query)
      .sort()
      .filter()
      .limit()
      .paginate();
    const allEmployer = await queriedEmployers.query;
    res.status(200).send(response(allEmployer, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.getEmployerByID = async (req, res) => {
  try {
    const { employerID } = req.params;
    const employer = await Employer.findById(employerID).populate(
      "organization"
    );

    if (!employer) {
      return res
        .status(404)
        .send(response({ err: "employer not found" }, true));
    }
    res.status(200).send(response(employer , false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.UpdateEmployer = async (req, res) => {
  try {
    let employerID =
      req.user.role === "employer" ? req.user._id : req.params.id;
    const update = req.body;
    const employer = await Employer.findByIdAndUpdate(employerID, update, {
      new: true,
    });

    if (!employer) {
      return res
        .status(404)
        .send(response({ err: "employer not found" }, true));
    }
    res.status(200).send(response({ employer }, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.deleteEmployer = async (req, res) => {
  try {
    let employerID =
      req.user.role === "employer" ? req.user._id : req.params.id;
    const deletedEmployer = await Employer.findByIdAndDelete(employerID);
    if (!deletedEmployer) return res.status(40);
  } catch (error) {
    res.status(500).send(response(error.message, true));
  }
};
