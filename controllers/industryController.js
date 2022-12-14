const { default: mongoose } = require("mongoose");
const { Industry } = require("../models/Industry");
const { response } = require("../utils/response");

exports.createIndustry = async (req, res) => {
  try {
    const { name } = req.body;
    const industryExists = await Industry.findOne({ name });
    if (industryExists)
      return res
        .status(409)
        .send(response("this industry already exists", true));
    const newIndustry = await Industry.create({ name });
    res.status(201).send(response(newIndustry));
  } catch (error) {
    console.log(error.message);
    res.status(400).send(response(error));
  }
};

exports.createManyIndustry = async (req, res) => {
  try {
    // const { name,id } = req.body;
    const industryExists = await Industry.find({
      name: { $in: req.body.name },
    });
    console.log(industryExists);
    if (industryExists.length > 0)
      return res
        .status(409)
        .send(response("this industry already exists", true));
    const newIndustry = await Industry.insertMany(req.body);
    res.status(201).send(response(newIndustry));
  } catch (error) {
    console.log(error.message);
    res.status(400).send(response(error));
  }
};

exports.getAllIndustry = async (req, res) => {
  try {
    const getAllIndustry = await Industry.find({});
    if (getAllIndustry.length === 0) {
      return res.status(404).send(response("industries not found", true));
    }
    res.status(200).send(response(getAllIndustry));
  } catch (error) {
    console.log(error.message);
    res.status(500).send(response(error));
  }
};

exports.getAnIndustryByID = async (req, res) => {
  try {
    const { industryID } = req.params;

    const getIndustry = await Industry.findOne({ id: industryID });
    if (!getIndustry) {
      return res.status(404).send(response("industries not found", true));
    }
    res.status(200).send(response(getIndustry));
  } catch (error) {
    console.log(error.message);
    res.status(500).send(response(error));
  }
};

exports.updateAnIndustryByID = async (req, res) => {
  try {
    const { industryID } = req.params;
    const { name } = req.body;
    const updatedIndustry = await Industry.findOneAndUpdate(
      { id: industryID },
      { name },
      { new: true }
    );
    if (!updatedIndustry) {
      return res.status(404).send(response("industry not found", true));
    }
    res.status(200).send(response(updatedIndustry));
  } catch (error) {
    console.log(error.message);
    res.status(500).send(response(error));
  }
};
exports.deleteAnIndustryByID = async (req, res) => {
  try {
    const { industryID } = req.params;

    const deletedIndustry = await Industry.findOneAndDelete({
      id: industryID,
    });
    if (!deletedIndustry) {
      return res.status(404).send(response("industry not found", true));
    }
    res.status(204).send(response(deletedIndustry));
  } catch (error) {
    console.log(error.message);
    res.status(500).send(response(error));
  }
};
