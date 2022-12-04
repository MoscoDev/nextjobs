const Employer = require("../models/Employer");
const Organization = require("../models/Organization");
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
    res.status(200).send(response({ allEmployer }, false));
  } catch (error) {
    res.status(500).send(response({ err: error.message }, error));
  }
};

exports.getEmployerByID = async (req, res) => {
  try {
    const _id = req.params.id;
    const employer = await Employer.findById(_id);

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


// exports.UpdateEmployer